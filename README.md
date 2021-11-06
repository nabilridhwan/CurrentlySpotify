# CurrentlySpotify (Backend)
> Get the currently playing song of the person logged in

# Future plans
-   Database to keep track of user's currently playing (currently, it only supports the current person who is logged in meaning that if someone elses goes to the `/` endpoint, their currently playing song will show up instead)

# Environment Variables (.env)
```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
REDIRECT_URI
PORT <Optional if running on server side>
```