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


var log2out = require('log2out');
var RequestFilter = require('./RequestFilter');

var Login = require('./Login');
var LoginMarshaller = require('./LoginMarshaller');
var LoginRequestFilterCallback = require('./LoginRequestFilterCallback');
var UsernameExtractor = require('./UsernameExtractor');

var LoginRequest = function(request, login, loginMarshaller, loginCallFactory, requestFilter, logger, usernameExtractor) {
	this.request = request;
	this.login = login || new Login();
	this.loginMarshaller = loginMarshaller || new LoginMarshaller();
	this.loginCallFactory = loginCallFactory || require('./loginCallFactory');
	this.requestFilter = requestFilter || new RequestFilter();
	this.logger = log2out.getLogger('LoginRequest');
	this.usernameExtractor = usernameExtractor || new UsernameExtractor();
};

LoginRequest.prototype.send = function(requestFinisher) {
	this.logger.debug('Sending LoginRequest: ' + this.request.parameters.methods);
	var method = this.request.parameters.methods;

	var result = this.loginMarshaller[method](this.request);
	var username = this.usernameExtractor.extract(this.request).toLowerCase();
	var loginCall = this.loginCallFactory.getLoginCall(this.request.parameters.methods, requestFinisher, result, this.login);
	this.requestFilter.filter(username, this.request.parameters.methods, this.request.headers.Host, new LoginRequestFilterCallback(loginCall, username));
};

module.exports = LoginRequest;
