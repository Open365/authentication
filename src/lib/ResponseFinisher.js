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

var ResponseFinisher = function(response, request) {
	this.response = response;
	this.request = request;
	this.logger = log2out.getLogger('Responsefinisher');
};

ResponseFinisher.prototype.end = function (returnValue) {
	if (returnValue.err) {
		this.logger.debug('There was an error during the execution:', returnValue.err);
		this.logger.debug('Rejecting the message');
		this.response.reject(true);
		return;
	}
	if (returnValue.status) {
		this.logger.debug('.end: sending custom status: ', returnValue.status);
		this.response.fail(returnValue.status);
		return;
	}

	this.logger.debug('.end: sending 200. \n=> returnValue:', returnValue.result, '\n=> request:', this.request);
	this.response.end(returnValue.result);
};

module.exports = ResponseFinisher;
