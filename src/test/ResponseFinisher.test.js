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

var sinon = require('sinon');
var assert = require('chai').assert;

var ResponseFinisher = require('../lib/ResponseFinisher');

suite('ResponseFinisher', function () {
	var sut, response, responseMock, returnValue, err, responseFailExpectation, responseEndExpectation;
	var request;
	var expResponseFailStatus;
	var username = 'vip.user';
    var signature = 'QeYyrD0xTNvqZ6IpL1zFsDI2FnI/5uw3MVs6Y+ZjqN1LC5LFeTxRbVFukoTOKSjY8FE8QUpLN50gTVcW3KURdA==';


    setup(function () {
		err = new Error('Fake message');
		response = {
			end: function () {},
			fail: function () {},
			reject: function () {}
		};
        returnValue = {result: {
				success: true,
				card: {
					expiration: 1423666413,
					renewCardDelay: 12600,
					username: username,
					permissions: ['eyeos.group.54906cd040d0a3dd5ca72602.administrator',
						'cacas.manage.admin',
						'eyeos.systemgroup.lodemasalla']
				},
				signature: signature
			}
		};
		request = { service: 'login',
			headers: {},
			method: 'POST',
			version: 'v1',
			path: '/login/v1/methods/login',
			userPath: '/methods/login',
			parameters: { methods: 'login' },
			document: { type: 'Basic', username: username, password: 'secret.pass' } }

		responseMock = sinon.mock(response);
		responseEndExpectation = responseMock.expects('end').once().withExactArgs(returnValue.result);
		responseFailExpectation = responseMock.expects('reject').once().withExactArgs(true);
		expResponseFailStatus = responseMock.expects('fail').once().withExactArgs(429);

		sut = new ResponseFinisher(response, request);
	});

	suite('#end', function () {
		test('Should call response end method with the returnValue, on successful login', function () {
			sut.end(returnValue);
			responseEndExpectation.verify();
		});

		test('calls response fail method with the error', function () {
			returnValue = {
				err: err
			};
			sut.end(returnValue);
			responseFailExpectation.verify();
		});

		test('calls response fail method with status code when returnValue.status evaluates to true', function () {
			returnValue = {
				status: 429
			};
			sut.end(returnValue);
			expResponseFailStatus.verify();
		});
	});
});
