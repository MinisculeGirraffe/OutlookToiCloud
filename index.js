const promptiCloud = require('./prompt-credentials');
const fs = require('fs');
const csv = require('@fast-csv/parse');
const argv = require('yargs').argv;
const os = require('os');

fs.createReadStream(argv.f)
    .pipe(csv.parse({headers: true, ignoreEmpty: true}))
    .on('error', (error) => console.error(error))
    .on('data', async (row) => transformRow(row))
    .on('end', async (rowCount) => {
      if (rowCount = contacts.length && contacts.length > 0) {
        try {
          await addContact(contacts);
          console.log('Sucessfully added ' + contacts.length);
          fs.unlinkSync(os.tmpdir() + '/icloud-session.json');
        } catch (error) {
          console.log(error);
        }
      }
    });

const contacts = [];
const transformRow = (row) => {
  const phones = [];
  Object.keys((row))
      .filter((key) => key.includes('Phone'))
      .forEach((phone) => {
        if (row[phone]) {
          const phoneOBJ = {
            field: row[phone],
            label: phone.substring(0, phone.indexOf(' ')).toUpperCase(),
          };
          phones.push(phoneOBJ);
        }
      });
  const addresses = [];
  // eslint-disable-next-line max-len
  const addressKeys = ['Street', 'City', 'State', 'Postal Code', 'Country/Region'];
  Object.keys(row)
      .filter((key) => new RegExp(addressKeys.join('|')).test(key))
      .map((key) => key.substring(0, key.indexOf(' ')))
      .reduce((acc, item) => acc.includes(item) ? acc : [...acc, item], [])
      .forEach((label) => {
        const placeholder = label + ' ';
        const addressOBJ = {
          field: {
            country: row[placeholder + 'Country/Region'],
            city: row[placeholder + 'City'],
            countryCode: '',
            street: row[placeholder + 'Street'],
            postalCode: row[placeholder + 'Postal Code'],
            state: row[placeholder + 'State'],

          },
          label: label.toUpperCase(),
        };
        const objCheck = Object.keys(addressOBJ.field)
            .some((key) => addressOBJ.field[key] != '');
        if (objCheck) {
          addresses.push(addressOBJ);
        }
      });
  const emails = [];
  Object.keys(row)
      .filter((key) => key.includes('E-mail'))
      .map((key) => key.replace(/[^0-9]/g, ''))
      .reduce((acc, item) => {
        const value = ' ' + item + ' ';
        if (acc.includes(value) ) {
          return acc;
        } else {
          return [...acc, value];
        }
      }, [])
      .forEach((key) => {
        const emailOBJ = {
          field: row['E-mail' + key + 'Addresss'],
          label: row['E-mail' + key + 'Address'],
        };
        if (emailOBJ.field !== '') {
          emails.push(emailOBJ);
        }
      });

  const dates = [];

  Object.keys(row)
      .filter((key) => ((key == 'Anniversary') || (key == 'Birthday')))
      .forEach((key) => {
        if (row[key] != '0/0/00') {
          const dateOBJ = {
            field: row[key],
            label: key,
          };
          dates.push(dateOBJ);
        }
      });

  const rawContact = {
    firstName: row['First Name'],
    lastName: row['Last Name'],
    middleName: row['Middle Name'],
    departmentName: row.department,
    companyName: row.Company,
    phones: phones,
    isCompany: false,
    streetAddresses: addresses,
    emailAddresses: emails,
    urls: [{
      field: row['Web Page'],
    }],
    dates: dates,
    suffix: row.Suffix,
    jobTitle: row['Job Title'],
  };

  const cleanContact = (obj) => {
    const extensions = [null, '', '0/0/00', 'Unspecified', '\r\n', undefined];
    if (Array.isArray(obj)) {
      return obj
          .map((value) => (value && typeof value === 'object') ? cleanContact(value) : value )
          .filter((value) => !(Object.keys(value).length == 0));
    } else {
      return Object.entries(obj)
          .map(([key, value]) => [key, value && typeof value === 'object' ? cleanContact(value) : value])
          .reduce((acc, [key, value]) => ((extensions.indexOf(value) > -1 || (Array.isArray(value) && value.length == 0)) ? acc : (acc[key]=value, acc)), {});
    }
  };

  contacts.push(cleanContact(rawContact));
};


const addContact = async (contacts) => {
  const myCloud = await promptiCloud();
  contacts.forEach(async (contact) => {
    const data = await myCloud.Contacts.list();
    const newChangeset = await myCloud.Contacts.new(contact);
    console.log(newChangeset);
  });
};
