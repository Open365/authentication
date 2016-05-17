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

var RequestLimitReachedCallback = function(service, request, settings) {
	this.service = service;
	this.request = request;
	this.settings = settings || require('../settings.js');
	this.logger = log2out.getLogger('RequestLimitReachedCallback');
};

RequestLimitReachedCallback.prototype.gotRequest = function(numOfRequest) {
	this.logger.debug('gotRequest: ' + numOfRequest);

	var service = this.service;
	var requestLimit = this.settings.requestFilter[service].requestLimit;

	this.logger.debug('gotRequest request for ' + service + ': ' + requestLimit);
	if (numOfRequest < requestLimit) {
		this.logger.debug('gotRequest: Calling reachedFinished false');
		this.request.reachedFinished(false);
		return;
	}

	this.logger.debug('gotRequest: Calling reachedFinished true');
	this.request.reachedFinished(true);
};

module.exports = RequestLimitReachedCallback;
