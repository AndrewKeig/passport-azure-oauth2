"use strict";

var util  = require("util");
var OAuth = require("passport-oauth").OAuth2Strategy;

function AzureOAuth2 (options, verify) {
  options = options || {};

  var base   = options.base   || "https://login.windows.net/";  
  var tenant = options.tenant || "common";
  
  var authorizationURL = base + tenant + "/oauth2/authorize";
  var tokenURL         = base + tenant + "/oauth2/token";

  options.authorizationURL = options.authorizationURL || authorizationURL;
  options.tokenURL = options.tokenURL || tokenURL;

  OAuth.call(this, options, verify);

  this.name = "azure_oauth2";
  this.resource = options.resource;
  this.prompt = options.prompt;
  this.state = options.state;
}

util.inherits(AzureOAuth2, OAuth);

AzureOAuth2.prototype.authenticate = function (req, options) {
  if (!options.resource && this.resource) {
    options.resource = this.resource;
  }

  if (!options.prompt && this.prompt) {
    options.prompt = this.prompt;
  }

  OAuth.prototype.authenticate.call(this, req, options);
};

AzureOAuth2.prototype.authorizationParams = function (options) {
  return options;
};

AzureOAuth2.prototype.userProfile = function (accessToken, done) {
  done(null, { provider: "azure_oauth2" });
};

module.exports = AzureOAuth2;
