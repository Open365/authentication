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

var LoginCaptchaAuth = function(authInfo) {
	this.username = authInfo.username || '';
	this.password = authInfo.password || '';
	this.domain = authInfo.domain || '';
	this.captchaId = authInfo.captchaId || '';
	this.captchaText = authInfo.captchaText || '';
};

LoginCaptchaAuth.prototype.getUsername = function() {
	return this.username.toLowerCase();
};

LoginCaptchaAuth.prototype.getPassword = function() {
	return this.password;
};

LoginCaptchaAuth.prototype.getDomain = function() {
	return this.domain;
};

LoginCaptchaAuth.prototype.getFullUsername = function() {
	return this.username.toLowerCase() + "@" + this.domain;
};

LoginCaptchaAuth.prototype.getCaptchaId = function() {
	return this.captchaId;
};

LoginCaptchaAuth.prototype.getCaptchaText = function() {
	return this.captchaText;
};

module.exports = LoginCaptchaAuth;
