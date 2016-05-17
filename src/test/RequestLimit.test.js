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
var RequestLimit = require('../lib/login/RequestLimit');
var RequestMeter = require('../lib/login/RequestMeter');

suite('RequestLimit', function(){
	var sut;
	var requestMeter, requestMeterMock;
	var expRequestMeterGet;
	var id = 'username', service = 'dummy';
	var fakeRequest = {
		getService: function() { return service;}
	};

	setup(function(){
		var fakeFactory = {
			getPersistence: function() {}
		};
		requestMeter = new RequestMeter(fakeFactory);
		requestMeterMock = sinon.mock(requestMeter);

		sut = new RequestLimit(requestMeter);
		expRequestMeterGet = requestMeterMock.expects('get').once().withExactArgs(id, service, sinon.match.object);
	});

	suite('#reached', function(){
		test('should call to RequestMeter.get with id and service', function(){
			sut.reached(id, service, fakeRequest);
			expRequestMeterGet.verify();
		});
	});
});