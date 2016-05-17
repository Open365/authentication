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
var PersistenceFactory = require('./persistence/PersistenceFactory');

var RequestMeter = function(persistenceFactory) {
	this.logger = log2out.getLogger('RequestMeter');
	persistenceFactory = persistenceFactory || new PersistenceFactory();
	this.persistence = persistenceFactory.getPersistence();
};

RequestMeter.prototype.get = function(id, service, callback) {
	this.logger.debug('.get: id: ' + id + ' service: ' + service);
	this.persistence.getRequest(id, service, callback);
};

RequestMeter.prototype.increment = function(id, service, callback) {
	this.logger.debug('.increment: id: ' + id + ' service: ' + service);
	this.persistence.incrementRequest(id, service, callback);
};

RequestMeter.prototype.clear = function(id, service) {
	this.logger.debug('.clear: id: ' + id + ' service: ' + service);
	this.persistence.clearRequest(id, service);
};

module.exports = RequestMeter;
