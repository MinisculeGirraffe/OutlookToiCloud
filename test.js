// Require function that already logs in and asks for the credentials if needed
const promptiCloud = require('./prompt-credentials');
const fs = require('fs');

(async () => {
  // Login to icloud and ask for new credentials if needed
  const myCloud = await promptiCloud();

  console.log('Getting contacts...');

  const contactsData = await myCloud.Contacts.list();
  fs.writeFileSync('./contacts.json', JSON.stringify(contactsData));
})();
