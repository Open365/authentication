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

var sinon = require('sinon');
var assert = require('chai').assert;
var Credentials = require('../lib/login/Credentials');

var DefaultCaptchaClient = require('../lib/login/captchaclient/default/DefaultCaptchaClient');
var Captcha = require('../lib/captcha').Captcha;

suite("DefaultCaptchaClient", function () {
	var sut, captcha, captchaMock;
	setup(function () {
		captcha = new Captcha();
		sut = new DefaultCaptchaClient(captcha);
	});

	test("#validate calls to captcha.validate", function () {
		var id = "test id",
			text = "test text",
			responseFinisher = "a responseFinisher instance",
			args = { id: id, text: text },
			credentials = new Credentials({
				getCaptchaId: function () {
					return id;
				},
				getCaptchaText: function () {
					return text;
				}
			}),
			exp;
		captchaMock = sinon.mock(captcha);
		exp = captchaMock.expects('validate').once().withExactArgs(responseFinisher, args);
		sut.validate(credentials, responseFinisher);
		exp.verify();
	});
});
