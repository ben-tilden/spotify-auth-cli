# Spotify CLI Authentication
A tiny helper tool that can be used to quickly fetch a Spotify access token from with the command line. This specifically utilizes the [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

### Installation
```
$ npm install -g spotify-auth-cli
```

### Usage
To retrieve an access token run the following command:

```
$ spotify-token --clientId <clientId> --clientSecret <clientSecret>
```

This will open the Spotify Login dialog in your default browser. After confirming, the window will close itself and if successful, you should see an access token in your console.

### Options
Several options are available when running the `spotify-token` command. The only options currently necessary are defined by the `--clientId` and `--clientSecret` flags.

#### Client ID
The `--clientId` flag specifies the Client ID for the Spotify Application in use.

#### Client Secret
The `--clientSecret` flag specifies the Client Secret for the Spotify Application in use.

#### Scope
The `--scope` option can be used to specify the scopes you wish to access. For ease of use, this tool will by default request access to ALL available scopes, so use this option to limit that.

Enter the scope as a comma separated list.
```
$ spotify-token --scope user-read-private,playlist-modify-private
```

#### Show Dialog
Add the `--showDialog` flag to prevent the Spotify Login dialog from automatically granting the request after you've already logged in once. Add this flag if you want to switch Spotify user.
