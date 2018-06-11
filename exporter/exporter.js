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

class ScriptSets
{
    constructor()
    {
        /**
         * @type {ScriptSet}
         */
        this.SeriesData;
        /**
         * @type {ScriptSet}
         */
        this.InternalData;
        /**
         * @type {ScriptSet}
         */
        this.SubmissionForm;
    }
}

class ScriptSet
{
    constructor()
    {
        /**
         * @type {String}
         */
        this.scriptId;
        /**
         * @type {String}
         */
        this.folderName;
    }
}

const sourceFolder = path.resolve(__dirname, '..') + '/src/'

/**
 * @type {ScriptSets}
 */
const scriptSets = require("./config.json").ScriptSets;

const OAuth2 = google.auth.OAuth2;
/**
 * Update script projects.
 * @param {OAuth2} auth An authorized OAuth2 client.
 */
async function callAppsScriptAsync(auth)
{
    console.log("Calling App Script.");

    const script = google.script({ version: 'v1', auth });

    await syncScriptAsync(scriptSets.SeriesData);
    //await syncScriptAsync(scriptSets.InternalData);
    //await syncScriptAsync(scriptSets.SubmissionForm);

    /**
     * Update one script project.
     * @param {ScriptSet} scriptSet 
     */
    async function syncScriptAsync(scriptSet)
    {
        const getFilesResponse = await script.projects.getContent({ scriptId: scriptSet.scriptId });
        var files = getFilesResponse.data.files;
        const path = sourceFolder + scriptSet.folderName + "/";
        const localFiles = fs.readdirSync(path);
        for (var key in files)
        {
            if (files.hasOwnProperty(key))
            {
                var exportFile = files[key];
                const localFile = localFiles.find(x => x.replace(".js", "") == exportFile.name)
                if (localFile)
                {
                    const fileSource = fs.readFileSync(path + localFile, 'utf-8');
                    exportFile.source = `// Synced from Google API Node.js client on： ${new Date().toLocaleString()}\n\n` + fileSource
                }
            }
        }

        console.log("Requested: " + path);

        const updateFilesResponse = await script.projects.updateContent
            ({
                scriptId: scriptSet.scriptId,
                requestBody: { files: files }
            });

        console.log(updateFilesResponse);
    }
}