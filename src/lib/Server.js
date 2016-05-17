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
var ServerStarter = require('./ServerStarter');
var MongooseSetup = require('./MongooseSetup');
var mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;
var ExtraKProvider = require('./login/ExtraKProvider');

var Server = function(serverStarter, settings, mongooseSetup, injectedExtraKProvider) {
	this.serverStarter = serverStarter || new ServerStarter();
	this.logger = log2out.getLogger('Server');
	this.settings = settings || require('./settings');
	this.mongoosetup = mongooseSetup || new MongooseSetup(this.settings);
	this.ExtraKProvider = injectedExtraKProvider || ExtraKProvider;
};

Server.prototype.start = function() {
	this.logger.debug('Starting Server');
	mongoDriverSingleton.connect(this.serverStarter, this.settings);

	var self = this;
	ExtraKProvider.initializeExtraK(function(err) {
		if (!err) {
			self.mongoosetup.start(function(started) {
				self.serverStarter.setMongoStarted(started);
			});
		} else {
			// This message means in reality that we can't get the eyeos public key
			// from the eyeos_logo.png to validate the license.
			self.logger.error('The code has been corrupted, stopping...');
		}
	});

};

module.exports = Server;
