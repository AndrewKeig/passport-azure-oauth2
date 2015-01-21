
# passport-azure-oauth2

Passport strategy for authenticating with Azure OAuth 2.0 API, with prompt and state support.

[![build status](https://travis-ci.org/AndrewKeig/passport-azure-oauth2.svg)](http://travis-ci.org/AndrewKeig/passport-azure-oauth2)

## Installation

```
npm install passport-azure-oauth2 --save
```

## Usage

Create a module `auth.js`:

```

"use strict";

/*jshint camelcase: false */

var AzureOAuth2Strategy  = require("passport-azure-oauth2");
var jwt 				  = require("jwt-simple");
var config 				  = require("../config");

function AzureOAuthStrategy() {
	this.passport = require("passport");
	
	this.passport.use("provider", new AzureOAuth2Strategy({
	  clientID: config.clientID,
	  clientSecret: config.clientSecret,
	  callbackURL: config.callbackUri,
	  resource: config.resource,
	  tenant: config.tenant,
	  prompt: 'login',
	  state: false
	},
	function (accessToken, refreshtoken, params, profile, done) {
	  var user = jwt.decode(params.id_token, "", true);
	  done(null, user);
	}));

	this.passport.serializeUser(function(user, done) {
		//console.log("profile : ", user);
		done(null, user);
	});

	this.passport.deserializeUser(function(user, done) {
		//console.log("profile : ", user);
		done(null, user);
	});
}

module.exports = new AzureOAuthStrategy();
```

Now plug this in like so:

```

var auth  	= require("./auth"),
var express = require("express")
var app     = express();

app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.get("/login", auth.passport.authenticate("provider", { successRedirect: "/" }));

app.get("/cb", 
    auth.passport.authenticate("provider", { 
    successRedirect: "/", 
    failureRedirect: "/login" }), function (req, res) { res.redirect("/"); });


```

###state

Simply plugin `express-session` to enable session support, and set `state: true` when creating your `AzureOAuthStrategy`

[Recommended] A randomly generated non-reused value that is sent in the request and returned in the response. This parameter is used as a mitigation against cross-site request forgery (CSRF) attacks. For more information, see Best Practices for OAuth 2.0 in Azure AD.


```
var session = require("express-session");

app.use( session({ 
    secret: 'somesecret', 
    resave: true, 
    saveUninitialized : true 
}));

```

###prompt

Simply set `prompt: 'login'` when creating your `AzureOAuthStrategy`

[Optional] Indicate the type of user interaction that is required.
Valid values are:

- login: The user should be prompted to re-authenticate.
- consent: User consent has been granted, but needs to be updated. The user should be prompted to consent. 
- admin_consent: An administrator should be prompted to consent on behalf of all users in their organization.

## Tests


```
npm test
```

## License

[MIT](https://github.com/andrewkeig/joi-contrib/blob/master/LICENSE)