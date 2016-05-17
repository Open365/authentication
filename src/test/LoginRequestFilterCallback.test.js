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

var LoginCall = require('../lib/login/LoginCall');
var LoginRequestFilterCallback = require('../lib/login/LoginRequestFilterCallback');


suite('LoginRequestFilterCallback', function(){
	var sut;
	var loginCall, loginCallMock;
	var expLoginCallExecute;

	var service = 'dummy';
	var username = 'username';
	setup(function(){

		loginCall = {
            getService: function(){return service},
            execute: function(){},
            discard: function(){}
        };

		loginCallMock = sinon.mock(loginCall);

		expLoginCallExecute = loginCallMock.expects('execute').once();

		sut = new LoginRequestFilterCallback(loginCall, username);
	});

	suite('#filterFinished', function(){

		test('Should call discard if argument is true', function(){
			var expLoginCallDiscard = loginCallMock.expects('discard').once();
			sut.filterFinished(true);
			expLoginCallDiscard.verify();
		});
	});

	suite('#checkFailed', function(){

		test('Should call discard with status 402', function(){
			var expDiscardWith402 = loginCallMock.expects('discard').once().withExactArgs({status: 402});
			sut.checkFailed();
			expDiscardWith402.verify();
		});
	});
});
