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

var RequestFactory = require('./RequestFactory');
var ResponseFinisher = require('./ResponseFinisher');
var log2out = require('log2out');

var AuthenticationRestRouter = function(requestFactory, logger) {
	this.requestFactory = requestFactory || new RequestFactory();
    this.logger = log2out.getLogger('AuthenticationRestRouter');
};

AuthenticationRestRouter.prototype.dispatch = function(analyzedRequest, httpResponse) {

	try {
		var request = this.requestFactory.getRequest(analyzedRequest);
	} catch (err) {
        this.logger.error('Invalid request' , err);
		httpResponse.invalidRequest(analyzedRequest);
		return;
	}

	var responseFinisher = new ResponseFinisher(httpResponse, analyzedRequest);
	try {
		request.send(responseFinisher);
	} catch (err) {
        this.logger.error('Error sending response: ' , err);
		httpResponse.fail(400, err.message);
	}
};

module.exports = AuthenticationRestRouter;
