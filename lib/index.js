const express = require('express');
const axios = require('axios');
const qs = require('qs');
const open = require('open');
const argv = require('minimist')(process.argv.slice(2));
const clipboardy = require('clipboardy');
const chalk = require('chalk');

const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const PORT = argv.port || 4815;
const CLIENT_ID = argv.clientId;
const CLIENT_SECRET = argv.clientSecret;
const SHOW_DIALOG = argv.showDialog || false;
const SCOPE = argv.scope ? argv.scope.split(',').join('%20') : [
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'streaming',
  'ugc-image-upload',
  'user-follow-modify',
  'user-follow-read',
  'user-library-read',
  'user-library-modify',
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played'
].join('%20');
const REDIRECT_URI = 'http://localhost:' + PORT + '/callback';
const STATE = generateRandomString(16);

const URL =
  'https://accounts.spotify.com/authorize'
  + '?client_id=' + CLIENT_ID
  + '&response_type=code'
  + '&scope=' + SCOPE
  + '&show_dialog=' + SHOW_DIALOG
  + '&redirect_uri=' + REDIRECT_URI
  + '&state=' + STATE;

const app = express();

app.get('/callback', (req, res) => {
  res.sendFile(__dirname + '/callback.html');
  if (req.query.error) {
    console.log(chalk.red('Something went wrong. Error: '), req.query.error);
  }
});

app.get('/token', async (req, res) => {
  const auth_code = req.query.code;
  const requestState = req.query.state;

  if (requestState === null || requestState !== STATE) {
    console.log(chalk.red('Request state not equivalent. Cancelling auth.'));
    res.sendStatus(403);
    process.exit();
  }

  res.sendStatus(200);

  const token_url = 'https://accounts.spotify.com/api/token';
  const auth_token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64');
  const data = qs.stringify({
    'grant_type': 'authorization_code',
    'code': auth_code,
    'redirect_uri': REDIRECT_URI
  });

  const getAuth = async (auth_token) => {
    try {
      const response = await axios.post(token_url, data, {
        headers: {
          'Authorization': `Basic ${auth_token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data.access_token;
    } catch(error) {
      console.log(chalk.red('Something went wrong. Error: '), error);
    }
  }

  token = await getAuth(auth_token);

  if (token) {
    clipboardy.writeSync(token);
    console.log(chalk.green('Your token is: '), chalk.bold(token));
    console.log('(It has been copied to your clipboard)');
  }
  process.exit();
})

const main = () => {
  app.listen(PORT, () => {
    if (CLIENT_ID && CLIENT_SECRET) {
      console.log(chalk.blue('Opening the Spotify Login Dialog in your browser...'));
      open(URL);
    } else {
      console.log(chalk.red('Necessary flags were not included - see README for more information.'));
      process.exit();
    }
  })
}

module.exports = main;
