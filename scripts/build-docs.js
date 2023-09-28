const _ = require('lodash');
const childProcess = require('child_process');
const fs = require('fs');

const COMPONENTS_DOCS_DIR = './docsRNC/docs';

const result = childProcess.execSync('find ./src -name "*api.json"');
const apiFiles = result.toString().trim().split('\n');

const components = apiFiles.map(filePath => {
  const file = fs.readFileSync(filePath);
  const api = JSON.parse(file.toString());
  return api;
});

if (!fs.existsSync(COMPONENTS_DOCS_DIR)) {
  fs.mkdirSync(COMPONENTS_DOCS_DIR);
}

if (components) {
  components.forEach(component => {
    /* General */
    let content = `${component.description}  \n`;
    content += `[(code example)](${component.example})\n`;

    if (component.extends) {
      let extendsText = component.extends?.join(', ');
      if (component.extendsLink) {
        extendsText = `[${extendsText}](${component.extendsLink})`;
      } else {
        const extendedComponentName = _.last(_.split(extendsText, '/'));
        extendsText = `[${extendedComponentName}](/docs/${extendsText})`;
      }
      content += `:::info\n`;
      content += `This component extends **${extendsText}** props.\n`;
      content += `:::\n`;
    }

    if (component.note) {
      const noteText = component.note;
      content += `**NOTE: ${noteText}**\n`;
    }

    /* Images */
    content += `<div style={{display: 'flex', flexDirection: 'row', overflowX: 'auto', maxHeight: '500px', alignItems: 'center'}}>`;
    component.images?.forEach(image => {
      content += `<img style={{maxHeight: '420px'}} src={'${image}'}/>`;
      content += '\n\n';
    });
    content += '</div>\n\n';

    /* Props */
    content += `## API\n`;
    component.props.forEach(prop => {
      content += `### ${prop.name}\n`;
      content += `${prop.description}  \n`;
      content += `<span style={{color: 'grey'}}>${prop.type}</span>\n\n`;
    });

    fs.writeFileSync(`${COMPONENTS_DOCS_DIR}/${component.name}.md`, content, {encoding: 'utf8'});
  });
}
