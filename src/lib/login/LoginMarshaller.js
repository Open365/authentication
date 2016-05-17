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

var CredentialsFactory = require('./CredentialsFactory');

var LoginMarshaller = function(credentialsFactory) {
	this.credentialsFactory = credentialsFactory || new CredentialsFactory();
};

LoginMarshaller.prototype.login = function(request) {
	return  {
		TID: request.headers["X-eyeos-TID"],
		credentials: this.credentialsFactory.getCredentials(request.document)
	};
};

LoginMarshaller.prototype.loginCaptcha = function(args) {
	return this.credentialsFactory.getCredentials(args.document);
};

LoginMarshaller.prototype.checkCard = function(args) {
	return args;
};

LoginMarshaller.prototype.renewCard = function(args) {
	return args;
};

LoginMarshaller.prototype.dummy = function() {

};

module.exports = LoginMarshaller;
