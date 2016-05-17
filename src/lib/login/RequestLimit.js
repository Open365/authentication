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
var RequestMeter = require('./RequestMeter');
var RequestLimitReachedCallback = require('./RequestLimitReachedCallback');

var RequestLimit = function(requestMeter) {
	this.logger = log2out.getLogger('RequestLimit');
	this.requestMeter = requestMeter || new RequestMeter();
};

RequestLimit.prototype.reached = function(id, service, objectCallback) {
	this.logger.debug('reached: ' + service);
	this.requestMeter.get(id, service, new RequestLimitReachedCallback(service, objectCallback));
};

module.exports = RequestLimit;