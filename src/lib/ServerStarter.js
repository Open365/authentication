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
var Server = require('eyeos-restutils').Server;
var AuthFilterNothing = require('eyeos-restutils').AuthFilterNothing;
var AuthenticationRestRouter = require('./AuthenticationRestRouter');
var AuthenticationPermissionsRouter = require('./AuthenticationPermissionsRouter');

var ServerStarter = function(server, logger, settings) {
	this.settings = settings || require('./settings');
	this.logger = log2out.getLogger('ServerStarter');
	var filter = new AuthFilterNothing();
	this.loginServer = server || new Server(new AuthenticationRestRouter(), this.settings.loginQueue, filter);
	this.captchaServer = server || new Server(new AuthenticationRestRouter(), this.settings.captchaQueue, filter);
	this.permissionsServer = server || new Server(new AuthenticationPermissionsRouter(), this.settings.permissionsQueue, filter);

	this.neededMongostarted = 2;
	this.mongoStarted = 0;
};

ServerStarter.prototype.setMongoStarted = function(started) {
	this.logger.debug('setMongoStarted: ' + started);
	if (!started) {
		process.exit(42);
	}

	this.mongoStarted += 1;
	if (this.mongoStarted === this.neededMongostarted) {
		this.logger.debug('Starting Login and Captcha Server');
		this.loginServer.start();
		this.captchaServer.start();
		this.permissionsServer.start();
	}
};

module.exports = ServerStarter;
