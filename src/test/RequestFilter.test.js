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
var RequestFilter = require('../lib/login/RequestFilter');
var RequestLimit = require('../lib/login/RequestLimit');
var settings = require('../lib/settings-test');
var ExtraFilter = require('../lib/login/ExtraFilter');

suite('RequestFilter', function(){
	var sut;
	var requestLimit, requestLimitMock;
	var extraFilter, extraFilterCheckStub;
	var id = 'username';
	var domain = 'eyeos.com';

	var service = 'dummy';
	var fakeObjectCallback = {
		filterFinished: function() {},
		checkFailed: function() {}
	};
	var fakeObjectCallbackMock;
	var expFilterfinished;

	setup(function(){
		requestLimit = new RequestLimit({});
		requestLimitMock = sinon.mock(requestLimit);
		fakeObjectCallbackMock = sinon.mock(fakeObjectCallback);
		extraFilter = new ExtraFilter({}, {}, {}, {}, {});
		extraFilterCheckStub = sinon.stub(extraFilter, 'check');

		expFilterfinished = fakeObjectCallbackMock.expects('filterFinished').once().withExactArgs(false);
		sut = new RequestFilter(requestLimit, extraFilter, settings);
	});

	teardown(function(){
		fakeObjectCallbackMock.restore();
	});

	suite('#filter', function(){
		test('should call RequestLimit.reached with id and service', function(){
			extraFilterCheckStub.callsArgWith(2, true);
			var expRequestLimitReached = requestLimitMock.expects('reached').once().withExactArgs(id, service, sinon.match.object);
			sut.filter(id, service, domain, fakeObjectCallback);
			expRequestLimitReached.verify();
		});
		test('should NOT call requestLimit.reached ', function () {
			var expRequestNeverLimitReached = requestLimitMock.expects('reached').never();
			service = 'another service';
			sut.filter(id, service, domain, fakeObjectCallback);
			expRequestNeverLimitReached.verify();
		});
		test('should NOT call requestLimit.reached if service is not in settings', function () {
			var expRequestNeverLimitReached = requestLimitMock.expects('reached').never();
			service = 'another service';
			sut.filter(id, service, domain, fakeObjectCallback);
			expRequestNeverLimitReached.verify();
		});
		test('should call objectCallback.filterFinished with false as argument', function () {
			service = 'another service';
			sut.filter(id, service, domain, fakeObjectCallback);
			expFilterfinished.verify();
		});
		test('when license user limit exceded should call checkFailed', function() {
			service = 'dummy';
			extraFilterCheckStub.callsArgWith(2, false);
			var expCheckfailed = fakeObjectCallbackMock.expects('checkFailed').once().withExactArgs();
			sut.filter(id, service, domain, fakeObjectCallback);
			expCheckfailed.verify();
		});
	});
});
