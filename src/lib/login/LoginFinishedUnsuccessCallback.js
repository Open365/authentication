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

var LoginResult = require("./LoginResult");

var LoginFinishedUnsuccessCallback = function(requestFinisher, loginResult) {
	this.requestFinisher = requestFinisher;
	this.loginResult = loginResult;
	this.logger = require('log2out').getLogger('LoginFinishedUnsuccessCallback');
};

LoginFinishedUnsuccessCallback.prototype.reachedFinished = function(reached) {

	this.logger.debug('.reachedFinished: ' + reached);
	if (reached) {
		this.loginResult = LoginResult.TOO_MANY_REQUESTS;
	}
	this.logger.debug('.reachedFinished: calling requestFinisher.end with: ' + this.loginResult.status);
	this.requestFinisher.end({status: this.loginResult.status});
};

module.exports = LoginFinishedUnsuccessCallback;