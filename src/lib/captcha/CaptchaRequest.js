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

var Captcha = require('./Captcha');
var CaptchaMarshaller = require('./CaptchaMarshaller');
var log2out = require('log2out');

var CaptchaRequest = function(request, captcha, captchaMarshaller) {
	this.request = request;
	this.captcha = captcha || new Captcha();
	this.logger = log2out.getLogger('CaptchaRequest');
	this.captchaMarshaller = captchaMarshaller || new CaptchaMarshaller(this.request);
};

CaptchaRequest.prototype.send = function(requestFinisher) {
	this.logger.debug("Sending CaptchaRequest: " + this.request.service);
	this.logger.debug(this.request);
	var method = this.request.method;
	var args = this.captchaMarshaller[this.request.service](this.request.parameters, this.request.document);
	this.captcha[this.request.service](requestFinisher, args, method);
};

module.exports = CaptchaRequest;
