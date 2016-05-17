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

var EyeosAuth = require('eyeos-auth');
var LoginSignCardCallback = require('./LoginSignCardCallback');
var log2out = require('log2out');

function LoginSuccessCallback(credentials, responseFinisher, eyeosAuthInjected) {
	this.credentials = credentials;
	this.responseFinisher = responseFinisher;
	this.eyeosAuth = eyeosAuthInjected || new EyeosAuth();
	this.logger = log2out.getLogger("LoginSuccessCallback");
}

LoginSuccessCallback.prototype.success = function(err, principal) {
	if (err) {
		this.logger.error(".success ", err);
		throw err;
	}
	this.logger.debug('.success got principal from DB: ', principal);
	this.logger.info("Completed login for user", principal.principalId, "successfully");
	var loginSignCardCallback = new LoginSignCardCallback(this.credentials, this.responseFinisher, principal);
	this.eyeosAuth.signCardForPrincipal(principal, loginSignCardCallback);
};

module.exports = LoginSuccessCallback;
