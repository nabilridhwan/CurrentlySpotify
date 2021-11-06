const express = require('express');
const app = express();

// Spotify web api
var SpotifyWebApi = require('spotify-web-api-node');

// DOTENV Config
require("dotenv").config();

// Remember your environment variables!
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = process.env.REDIRECT_URI;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = process.env.PORT || 3000;

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
    // Redirect to login page because of expired token or token not available
    res.redirect('/login')
  }
})

app.get('/login', function (req, res) {
  var scope = ['user-read-private', 'user-read-email', 'user-read-currently-playing'];
  res.redirect(spotifyApi.createAuthorizeURL(scope, state = '12345'));
});

app.get('/callback', async (req, res) => {

  let {
    error,
    code
  } = req.query

  if (error) {
    res.send(ResponseJSON(400, 'Error', error))
  } else {

    let data = await spotifyApi.authorizationCodeGrant(code)
    refreshToken = data.body.refresh_token;
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    res.redirect('/')
  }
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