import * as fs from 'fs';
import * as YAML from 'yaml';

const infoFile = fs.readFileSync('./info.yaml', 'utf8');
const info = YAML.parse(infoFile);
const packageFilePath = './app/package.json';
const packageFile = fs.readFileSync(packageFilePath, 'utf8');
const appPackage = JSON.parse(packageFile);
const snapcraftFilePath = './snap/snapcraft.yaml';
const snapcraftFile = fs.readFileSync(snapcraftFilePath, 'utf8');
const snapcraft = YAML.parse(snapcraftFile);

if (info.description) {
  appPackage.description = info.description.split('\n').join(' ');
  snapcraft.description = info.description;
}

fs.writeFileSync(packageFilePath, JSON.stringify(appPackage, null, 2));
fs.writeFileSync(snapcraftFilePath, YAML.stringify(snapcraft));
console.log('Application info updated');
