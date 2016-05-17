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
var RequestLimit = require('./RequestLimit');
var RequestFilterCallback = require('./RequestFilterCallback');
var ExtraFilter = require('./ExtraFilter');

var RequestFilter = function(requestLimit, extraFilter, settings) {
	this.logger = log2out.getLogger('RequestFilter');
	this.settings = settings || require('../settings');
	this.requestLimit = requestLimit || new RequestLimit();
	this.extraFilter = extraFilter || new ExtraFilter();
};

/**
 * Filters the given request with two possible outcomes, the
 * request will either be executed or discard.
 */
RequestFilter.prototype.filter = function(userId, serviceId, host, objectCallback) {
	this.logger.debug('filter: ' + serviceId);

	//if there are not filter configured, just return
	if (!this.settings.requestFilter) {
		this.logger.debug('No filters configured, executing request');
		objectCallback.filterFinished(false);
		return;
	}

	if (!this.settings.requestFilter[serviceId]) {
		this.logger.debug('No filters configured for: ' + serviceId + ', executing request');
		objectCallback.filterFinished(false);
		return;
	}

	var self = this;
	this.extraFilter.check(userId, host, function(ok) {
		if (ok) {
			if (self.settings.requestFilter[serviceId].requestLimit) {
				self.requestLimit.reached(userId, serviceId, new RequestFilterCallback(objectCallback));
				return;
			} else {
				objectCallback.filterFinished(false);
			}
		} else {
			objectCallback.checkFailed();
		}
	});


};

module.exports = RequestFilter;
