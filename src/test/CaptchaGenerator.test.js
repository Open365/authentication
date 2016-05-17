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
var captchagen = require('captchagen');

var CaptchaGenerator = require("../lib/captcha/CaptchaGenerator");

suite("CaptchaGenerator", function () {
	var sut,
		width, height,
		text,
		blob,
		captchagenMock,
		captchaMock,
		captchaMockGenerateExp,
		captchaMockTextExp,
		captchaMockBufferExp,
		captchaGenerateExp;

	setup(function () {
		text = "asdw16";
		blob = "BIG BLOB!";
		width= 100;
		height= 200;
		var withHeightExp = {
			width: width,
			height: height
		};

		var captcha = captchagen.create();

		captchaMock = sinon.mock(captcha);
		captchaMockGenerateExp = captchaMock.expects('generate').once().withExactArgs();
		captchaMockTextExp = captchaMock.expects('text').once().withExactArgs().returns(text);
		captchaMockBufferExp = captchaMock.expects('buffer').once().withExactArgs().returns(blob);


		captchagenMock = sinon.mock(captchagen);
		captchaGenerateExp = captchagenMock.expects('create').once().withExactArgs(withHeightExp).returns(captcha);

		sut = new CaptchaGenerator(captchagen);
	});

	teardown(function () {
		captchagenMock.restore();
	});

	suite("#generate", function () {
		test("calls captchagen.create with width and height", function () {
			sut.generate(width, height);
			captchaGenerateExp.verify();
		});

		test("calls captcha.generate", function () {
			sut.generate(width, height);
			captchaMockGenerateExp.verify();
		});

		test("calls captcha.text", function () {
			sut.generate(width, height);
			captchaMockTextExp.verify();
		});

		test("calls captcha.buffer", function () {
			sut.generate(width, height);
			captchaMockBufferExp.verify();
		});

		test("returns object with text and blob", function () {
			var exp = {
				text: text,
				blob: blob
			};

			var result = sut.generate(width, height);

			assert.deepEqual(exp, result);
		});
	});
});



//var captcha = captchagen.create({
//	width: 150,
//	height: 150
//});
