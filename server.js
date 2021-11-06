const express = require('express');
const app = express();

var SpotifyWebApi = require('spotify-web-api-node');

// DOTENV Config
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});

app.get('/', async (req, res) => {

  try {
    let data = await spotifyApi.getMyCurrentPlayingTrack()
    res.send(ResponseJSON(200, 'Success', data))
  } catch (err) {
    res.redirect('/login')
  }

})

app.get('/login', function (req, res) {
  var scope = ['user-read-private', 'user-read-email', 'user-read-currently-playing'];
  res.redirect(spotifyApi.createAuthorizeURL(scope, state = '12345'));
});

app.get('/callback', (req, res) => {

  let {
    error,
    code
  } = req.query

  if (error) {
    res.send(`Error: ${error}`)
  } else {
    res.redirect(`/access_token/${code}`)
  }
})

app.get('/access_token/:code', async (req, res) => {

  const {
    code
  } = req.params;

  let data = await spotifyApi.authorizationCodeGrant(code)
  refreshToken = data.body.refresh_token;
  spotifyApi.setAccessToken(data.body['access_token']);
  spotifyApi.setRefreshToken(data.body['refresh_token']);
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

function ResponseJSON(status, message, data) {
  return {
    status,
    message,
    data
  }
}