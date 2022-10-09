require('dotenv').config();
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const increase = async (person, sum) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const metadata = await sheets.spreadsheets.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
  });

  let getRows = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Sheet1!B2:D4',
  });

  let currentData = getRows.data.values;

  ch = 0.25 * sum;
  pol = 0.5 * sum;
  if (person === 'fuergrissaostdrauka' || person === 'OlliSergeevna') {
    currentData[0][1] = parseInt(currentData[0][1]) + ch;
    currentData[0][2] = parseInt(currentData[0][2]) + ch;
  } else if (person === 'MrFeyman') {
    currentData[1][0] = parseInt(currentData[1][0]) + pol;
    currentData[1][2] = parseInt(currentData[1][2]) + ch;
  } else if (person === 'Viator08') {
    currentData[2][0] = parseInt(currentData[2][0]) + pol;
    currentData[2][1] = parseInt(currentData[2][1]) + ch;
  } else {
    return;
  }
  await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Sheet1!B2:D4',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: currentData,
    },
  });
};

const decrease = async (person1, person2, sum) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const metadata = await sheets.spreadsheets.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
  });

  let getRows = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Sheet1!B2:D4',
  });

  let currentData = getRows.data.values;
  if (
    (person1 === 'fuergrissaostdrauka' || person1 === 'OlliSergeevna') &&
    person2 === 'MrFeyman'
  ) {
    currentData[1][0] = parseInt(currentData[1][0]) - sum;
  } else if (
    (person1 === 'fuergrissaostdrauka' || person1 === 'OlliSergeevna') &&
    person2 === 'Viator08'
  ) {
    currentData[2][0] = parseInt(currentData[2][0]) - sum;
  } else if (
    person1 === 'MrFeyman' &&
    (person2 === 'fuergrissaostdrauka' || person2 === 'OlliSergeevna')
  ) {
    currentData[0][1] = parseInt(currentData[0][1]) - sum;
  } else if (person1 === 'MrFeyman' && person2 === 'Viator08') {
    currentData[2][1] = parseInt(currentData[2][1]) - sum;
  } else if (
    person1 === 'Viator08' &&
    (person2 === 'fuergrissaostdrauka' || person2 === 'OlliSergeevna')
  ) {
    currentData[0][2] = parseInt(currentData[0][2]) - sum;
  } else if (person1 === 'Viator08' && person2 === 'MrFeyman') {
    currentData[1][2] = parseInt(currentData[1][2]) - sum;
  } else {
    return;
  }

  await sheets.spreadsheets.values.update({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Sheet1!B2:D5',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: currentData,
    },
  });
};

const balance = async (person) => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const metadata = await sheets.spreadsheets.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
  });

  let getRows = await sheets.spreadsheets.values.get({
    auth,
    spreadsheetId: process.env.SPREAD_SHEET_ID,
    range: 'Sheet1!B2:D4',
  });

  let currentData = getRows.data.values;

  if (person === 'fuergrissaostdrauka' || person === 'OlliSergeevna') {
    return { debt1: currentData[1][0], person1: 'Диме', debt2: currentData[2][0], person2: 'Саше' };
  } else if (person === 'MrFeyman') {
    return {
      debt1: currentData[0][1],
      person1: 'Хомякам',
      debt2: currentData[2][1],
      person2: 'Саше',
    };
  } else if (person === 'Viator08') {
    return {
      debt1: currentData[0][2],
      person1: 'Хомякам',
      debt2: currentData[1][2],
      person2: 'Диме',
    };
  } else return;
};

module.exports.increase = increase;
module.exports.decrease = decrease;
module.exports.balance = balance;
