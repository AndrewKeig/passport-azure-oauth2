var assert 	= require('assert');
var sinon 	= require('sinon');
var OAuth 	= require("passport-oauth").OAuth2Strategy;
var Azure  = require('../lib');

describe('azure oauth 2 passport strategy', function() {

	var OAuth = require("passport-oauth").OAuth2Strategy;
	var strategy;
	
	describe('when creating strategy', function() {

		it('should create instance', function() {
			strategy = new Azure({
				  clientID: '1212121212',
				  clientSecret: '23232323232',
				  callbackURL: 'localhost',
				  resource: '099909009009',
				  tenant: '78788787887',
				  prompt: 'login',
				  state: true
				},
				function () { return; });

		});

		it('should contain correct name', function() {
			assert.equal(strategy.name, 'azure_oauth2');
		});

		it('should contain prompt', function() {
			assert.equal(strategy.prompt, 'login');
		});

		it('should contain state', function() {
			assert.equal(strategy.state, true);
		});

		it('should contain resource', function() {
			assert.equal(strategy.resource, '099909009009');
		});

		it('should contain authorizeUrl', function() {
			assert.equal(strategy._oauth2._authorizeUrl, 'https://login.windows.net/78788787887/oauth2/authorize');
		});

		it('should contain accessTokenUrl', function() {
			assert.equal(strategy._oauth2._accessTokenUrl, 'https://login.windows.net/78788787887/oauth2/token');
		});
	});

	describe('when creating strategy with no tenant', function() {

		it('should create instance', function() {
			strategy = new Azure({
				  clientID: '1212121212',
				  clientSecret: '23232323232',
				  callbackURL: 'localhost',
				  resource: '099909009009'
				},
				function () { return; });
		});

		it('should contain authorizeUrl', function() {
			assert.equal(strategy._oauth2._authorizeUrl, 'https://login.windows.net/common/oauth2/authorize');
		});

		it('should contain accessTokenUrl', function() {
			assert.equal(strategy._oauth2._accessTokenUrl, 'https://login.windows.net/common/oauth2/token');
		});
	});

	describe('when calling authenticate', function() {

		var stub;

		it('should set options', function() {
			stub  = sinon.stub(OAuth.prototype.authenticate, "call");

			strategy = new Azure({
				  clientID: '1212121212',
				  clientSecret: '23232323232',
				  callbackURL: 'localhost',
				  resource: '099909009009',
				  tenant: '78788787887',
				  prompt: 'login'
				},
				function () { return; });

			strategy.authenticate({ prompt: 'login', resource: '099909009009' }, {});
			stub.restore();
		});

		it('should call oauth strategy', function() {
			assert(stub.calledOnce);
		});
	});

	describe('when calling authenticate', function() {

		it('should set options', function(done) {

			strategy = new Azure({
				  clientID: '1212121212',
				  clientSecret: '23232323232',
				  callbackURL: 'localhost',
				  resource: '099909009009',
				  tenant: '78788787887'
				},
				function () { return; });

			strategy.userProfile('10101101010', function(err, data){
				assert.equal(data.provider, 'azure_oauth2');
				done();
			});
		});
	});

	describe('when calling authorizationParams', function() {
		var input = { prompt: 'login', resource: '099909009009' };
		var options;

		it('should set options', function() {
			strategy = new Azure({
				  clientID: '1212121212',
				  clientSecret: '23232323232',
				  callbackURL: 'localhost',
				  resource: '099909009009',
				  tenant: '78788787887',
				  prompt: 'login'
				},
				function () { return; });

			options = strategy.authorizationParams(input);
		});

		it('should call oauth strategy', function() {
			assert.equal(options,input);
		});
	});
});