# OutlookToiCloud

Pure NodeJS utility to batch import an outlook contact CSV file into iCloud. 


### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
git clone https://github.com/MinisculeGirraffe/OutlookToiCloud.git
cd OutlookToiCloud
npm install
```

## Usage
Export contacts from [OWA](https://support.microsoft.com/en-us/office/export-contacts-from-outlook-com-to-a-csv-file-578cca22-3550-4c73-b3f0-9978cfeac83f)  or desktop [Outlook](https://support.microsoft.com/en-us/office/export-contacts-from-outlook-10f09abd-643c-4495-bb80-543714eca73f) to a CSV file.


Feed the file into index.js

```
node index.js -f file.csv
```

You will be prompted to enter iCloud account info and 2FA if necessary. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Adderall


