const fs = require('fs');
const path = require('path');
const directoryPath = '../../doc/flavor_wheel';
const outputFilePath = path.join("./", 'result.md');

function convertToJsonLines(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonData = JSON.parse(fileContent);

  const sortedKeys = Object.keys(jsonData).sort();

  const lines = sortedKeys.map((key) => {
    const items = jsonData[key];
    return `"${key}": "${items.map((item) => `${item}`).join(', ')}"`;
  });
  return lines.join('\n');
}

function writeResultToFile(result) {
  fs.writeFileSync(outputFilePath, result);
  console.log(`Result written to ${outputFilePath}`);
}

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  let result = '';
  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.json') {
      const jsonLines = convertToJsonLines(filePath);
      result += `File: ${file}\n${jsonLines}\n\n`;
    }
  });

  writeResultToFile(result);
});
