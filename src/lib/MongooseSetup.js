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

var mongoose = require('mongoose');
var log2out = require('log2out');

var MongooseSetup = function(settings) {
	this.settings = settings;
	this.logger = log2out.getLogger('MongooseSetup');
};

MongooseSetup.prototype.start = function(readyCallback) {
	var dbLink  = 'mongodb://' + this.settings.mongoInfo.host + ':' + this.settings.mongoInfo.port + '/' + this.settings.mongoInfo.db;
	this.logger.info('.start Connecting to mongo at ' + dbLink + ' via mongoose');

	mongoose.connect(dbLink);

	var self = this;
	var conn = mongoose.connection;
	conn.on('error', function(err){
		self.logger.error('mongoose connection error:', err)
		readyCallback(false);
	});
	conn.once('open', function() {
		self.logger.debug('.start Connection opened');
		readyCallback(true);
	});
};

module.exports = MongooseSetup;
