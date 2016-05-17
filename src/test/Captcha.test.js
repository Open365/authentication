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
var Captcha = require('../lib/captcha/Captcha');
var CaptchaGenerator = require("../lib/captcha/CaptchaGenerator");
var PersistenceManager = require("../lib/captcha/PersistenceManager");
var Settings = require('../lib/settings');

suite("Captcha", function () {
	var sut, width, height, text, blob, responseFinisher, args, method;
	var captchaGenerator, captchaGeneratorMock;
	var persistenceManager, persistenceManagerMock;

	setup(function () {
        responseFinisher = "a responseFinisher instance";
		width = Settings.captcha.width;
		height = Settings.captcha.height;

		text = "fakeText";
		blob = "BIG BLOB!!!!";

		captchaGenerator = new CaptchaGenerator();
		captchaGeneratorMock = sinon.mock(captchaGenerator);

		persistenceManager = new PersistenceManager();
		persistenceManagerMock = sinon.mock(persistenceManager);

		sut = new Captcha(captchaGenerator, persistenceManager);
	});
	suite("#captcha", function () {
		var persistenceManagerStoreExp,
			captchaGeneratorMockGenerateExp;
		suite("when method is GET", function () {
			setup(function () {
				var storeArgs = {
					text: text,
					blob: blob
				};
				args = {};
				method = 'GET';
				captchaGeneratorMockGenerateExp = captchaGeneratorMock.expects('generate').once().withExactArgs(width, height).returns(storeArgs);
				persistenceManagerStoreExp = persistenceManagerMock.expects("store").once().withExactArgs(responseFinisher, storeArgs);
			});
			test("calls captchaGenerator.generate", function () {
				sut.captcha(responseFinisher, args, method);
				captchaGeneratorMockGenerateExp.verify();
			});

			test("calls persistenceManager.store", function () {
				sut.captcha(responseFinisher, args, method);
				persistenceManagerStoreExp.verify();
			});
		});

		suite("when method is POST", function () {
			var persistenceManageValidateExp;
			setup(function () {
				args = {};
				method = 'POST';
				persistenceManageValidateExp = persistenceManagerMock.expects("validate").once().withExactArgs(responseFinisher, args);
			});
			test("calls persistenceManager.store", function () {
				sut.captcha(responseFinisher, args, method);
				persistenceManageValidateExp.verify();
			});
		});
	});

});
