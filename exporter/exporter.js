const fs = require('fs');
const readline = require('readline');
const path = require('path')
const { google } = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/script.projects'];
const TOKEN_PATH = __dirname + '/credentials.json';

// Load client secrets from a local file.
fs.readFile(__dirname + '/client_secret.json', (err, content) =>
{
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), callAppsScriptAsync);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback)
{
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) =>
    {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback)
{
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) =>
    {
        rl.close();
        oAuth2Client.getToken(code, (err, token) =>
        {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) =>
            {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

const SeriesDataScriptId = "1A3GupJKPAYTDbQ7iE9MnVzrYT9LACBz1dIYw1hMbWFxC-6B5CWoFAmhU";
const InternalDataScriptId = "1Gei8xbj_w0XSqOJxZjodZ3kRT1BU2BRQHSdtN4L3wyr1zv6vJUw1egmE";

const sourceFolder = path.resolve(__dirname, '..') + '/src/'

const scriptSets =
{
    SeriesData:
    {
        scriptId: SeriesDataScriptId,
        folder: sourceFolder + 'Series Data/'
    },
    InternalData:
    {
        scriptId: InternalDataScriptId,
        folder: sourceFolder + 'Internal Data/'
    }
}

const OAuth2 = google.auth.OAuth2;
/**
 * Update script projects.
 * @param {OAuth2} auth An authorized OAuth2 client.
 */
async function callAppsScriptAsync(auth)
{
    const script = google.script({ version: 'v1', auth });

    await syncScriptsAsync(scriptSets.SeriesData);

    const ScriptSet = scriptSets.SeriesData;
    /**
     * 
     * @param {ScriptSet} scriptSet 
     */
    async function syncScriptsAsync(scriptSet)
    {
        const getFilesResponse = await script.projects.getContent({ scriptId: scriptSet.scriptId });
        var files = getFilesResponse.data.files;
        var localFiles = fs.readdirSync(scriptSet.folder);
        for (var key in files)
        {
            if (files.hasOwnProperty(key))
            {
                var exportFile = files[key];
                var localFile = localFiles.find(x => x.startsWith(exportFile.name));
                if (localFile)
                {
                    var fileSource = fs.readFileSync(scriptSet.folder + localFile, 'utf-8');
                    exportFile.source = fileSource
                }
            }
        }

        const updateFilesResponse = await script.projects.updateContent
            ({
                scriptId: scriptSet.scriptId,
                requestBody: { files: files }
            });

        console.log(updateFilesResponse);
    }
}