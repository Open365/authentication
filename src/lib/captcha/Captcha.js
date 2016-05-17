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

var CaptchaGenerator = require("./CaptchaGenerator");
var PersistenceManager = require("./PersistenceManager");
var Settings = require('../settings');
var log2out = require('log2out');

var Captcha = function (generator, persistenceManager) {
	this.generator = generator || new CaptchaGenerator();
	this.persistenceManager = persistenceManager || new PersistenceManager();
	this.captchaOptions = Settings.captcha;
	this.logger = log2out.getLogger('Captcha');
};

// @Private
function _generateCaptcha (responseFinisher, width, height) {
	this.logger.info('Getting a new captcha');
	var data = this.generator.generate(width, height);
	this.persistenceManager.store(responseFinisher, data);
}

Captcha.prototype.captcha = function (responseFinisher, args, method) {
	if (method === 'GET') {
		_generateCaptcha.call(this, responseFinisher, this.captchaOptions.width, this.captchaOptions.height);
	} else {
		this.validate(responseFinisher, args);
	}
};

Captcha.prototype.validate = function (responseFinisher, args) {
	this.logger.info('Validating the captcha');
	this.persistenceManager.validate(responseFinisher, args);
};

module.exports = Captcha;
