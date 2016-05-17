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
var LDAPSanitizer = require('../lib/login/providers/base/LDAPSanitizer');

suite('LDAPSanitizer', function () {
	var sut;

	setup(function () {
		sut = LDAPSanitizer;
	});

	suite('sanitize', function () {
        var invalidChars = ['\\',',', '+', '"', '<', '>', ';'];

        var testWithData = function (dataItem) {
            return function () {
                var retVal = sut.sanitize("test" + dataItem + "user");
                assert.equal(retVal, "test\\" +dataItem+ "user");
            };
        };

        invalidChars.forEach(function (invalidChar) {
            test("when called with "+invalidChar+ "should return escaped character", testWithData(invalidChar));
        });

		test("when called with more than one invalid char should return escaped character", function () {
			var retVal = sut.sanitize('test;u+ser');
			assert.equal(retVal, 'test\\;u\\+ser');
		});

	});
});
