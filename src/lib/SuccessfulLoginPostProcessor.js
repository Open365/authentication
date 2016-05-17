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

'use strict';

var log2out = require('log2out');
var Client = require('eyeos-consume-service').Client;
var EyeCrypt = require('eyeos-crypt').EyeCrypt;
var settings = require('./settings');

var getFullName = function(user) {
	if(!user) {
		return null;
	} else if(user.firstName && user.lastName) {
		return user.firstName + ' ' + user.lastName;
	} else {
		return user.principalId;
	}
};

/**
 * SuccessfulLoginPostProcessor handles actions that must be performed after a successful login.
 * @constructor
 */


var SuccessfulLoginPostProcessor = function(injectedSettings, injectedConsumeService, eyeCrypt) {
    this.settings = injectedSettings || settings.successfulLogin;
    this.logger = log2out.getLogger('SuccessfulLoginPostProcessor');
    this.consumeService = injectedConsumeService || new Client(this.settings.exchange);
	this.eyeCrypt = eyeCrypt || new EyeCrypt(this.settings.crypto);
};

SuccessfulLoginPostProcessor.prototype.success = function(username, password, card, signature, principal) {
    this.logger.debug('Starting after successfulLogin actions:', arguments);
    var headers = {card: JSON.stringify(card), signature: signature};

	var self = this;
	this.eyeCrypt.encrypt(password, function(err, encryptedPassword) {
		if (err) {
			throw err;
		}
		var msg = JSON.stringify(
			{
				username: username,
				password: encryptedPassword,
				card: card,
				signature: signature,
				fullName: getFullName(principal),
				loginTs: Date.now()
			}
		);
		self.consumeService.post(self.settings.exchange.postUrl, headers, msg);
	});
};

module.exports = SuccessfulLoginPostProcessor;