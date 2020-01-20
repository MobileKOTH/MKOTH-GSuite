const fs = require("fs")
const path = require("path")

const targetFile = path.join(__dirname, process.argv[2])
const fileStream = fs.readFileSync(targetFile)
const fileText = fileStream.toString()
const fileLines = fileText.split("\n")

if (!fileLines[0].startsWith("// Compiled on"))
{
    fileLines.unshift("")
}

fileLines[0] = `// Compiled on ${new Date()}\r`

fs.writeFileSync(targetFile, fileLines.join("\n"))
