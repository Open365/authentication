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
var CaptchaMarshaller = require('../lib/captcha/CaptchaMarshaller');

suite("CaptchaMarshaller", function () {
	var sut, id, text;
	setup(function () {
		id = "test id";
		text  = "test id";
		sut = new CaptchaMarshaller();
	});

	suite("#captcha", function () {
		test("returns valid args when params are ok", function () {
			var params = { captcha: id},
				document = { text: text },
				expectation = { id: id, text: text };
			assert.deepEqual(sut.captcha(params, document), expectation);
		});
		test("returns void args when params are ko", function () {
			var params = {},
				document = {},
				expectation = { id: "", text: "" };
			assert.deepEqual(sut.captcha(params, document), expectation);
		});
		test("returns void args when no document", function () {
			var params = {},
				document = null,
				expectation = { id: "" };
			assert.deepEqual(sut.captcha(params, document), expectation);
		});
	});
});
