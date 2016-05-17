/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var LoginCallback = require('./LoginCallback');
var LoginResultHandler = require('./LoginResultHandler');
var CaptchaClientFactory = require('./captchaclient/CaptchaClientFactory');
var ValidateResolver = require('./captchaclient/ValidateResolver');
var log2out = require('log2out');
var EyeosAuth = require('eyeos-auth');
var RenewCardCallback = require('./RenewCardCallback');
var ResponseGenerator = require('./ResponseGenerator');
var PrincipalProvider = require('eyeos-principal').PrincipalProvider;
var mongoose = require('mongoose');

var Login = function(providerFactory, captchaClientFactory, eyeosAuth, responseGenerator, rsaSigner) {
    if (!eyeosAuth) {
        if (!rsaSigner) {
            var Principal = require('eyeos-principal').PrincipalSchema(mongoose).getModel();
            var SystemGroup = require('eyeos-principal').SystemGroupSchema(mongoose).getModel();

            this.rsaSigner = EyeosAuth.createRsaSigner(new PrincipalProvider(Principal, SystemGroup));
        } else {
            this.rsaSigner = rsaSigner;
        }
        this.eyeosAuth = new EyeosAuth(null, null, this.rsaSigner);
    } else {
        this.eyeosAuth = eyeosAuth;
    }

	providerFactory = providerFactory || new (require('./providers/ProviderFactory'));
	this.provider = providerFactory.getProvider();
	this.captchaClientFactory = captchaClientFactory || new CaptchaClientFactory;
	this.logger = log2out.getLogger("Login");
	this.responseGenerator = responseGenerator || new ResponseGenerator();
};

Login.prototype.login = function(pojo, requestFinisher, loginCallback) {
	this.logger.info("Recieved login request for user", pojo.credentials.getAuthInfo().getUsername());
	loginCallback = loginCallback || new LoginCallback(new LoginResultHandler(pojo.credentials, requestFinisher), pojo.TID);

	this.provider.login(pojo.credentials, loginCallback);
};

Login.prototype.loginCaptcha = function(credentials, requestFinisher) {
	this.logger.info("Recieved loginCaptcha request for user", credentials.getAuthInfo().getUsername());
	var captchaClient = this.captchaClientFactory.getCaptchaClient();
	captchaClient.validate(credentials, new ValidateResolver(this, credentials, requestFinisher));
};

Login.prototype.checkCard = function(request, requestFinisher) {
    this.logger.debug(".checkCard", request);
	var validCard = this.eyeosAuth.verifyRequest(request);
	var response = this.responseGenerator.getValidCardResponse(validCard);
    this.logger.debug(".checkCard response: ", response);
	requestFinisher.end(response);
};

Login.prototype.renewCard = function(request, requestFinisher) {
	this.eyeosAuth.renewCard(request, new RenewCardCallback(requestFinisher));
};

Login.prototype.dummy = function() {
};

module.exports = Login;
