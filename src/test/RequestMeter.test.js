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
var RequestMeter = require('../lib/login/RequestMeter');
var DummyPersistence = require('../lib/login/persistence/dummy/');

suite('RequestMeter', function(){
	var sut;
	var persistence, persistenceMock;
	var expPersistenceGetRequest, expPersistentIncrementRequest;
	var expPersistentClearRequest;
	var id = 'username', service = 'login';

	setup(function(){
		persistence = new DummyPersistence();
		persistenceMock = sinon.mock(persistence);
		expPersistenceGetRequest = persistenceMock.expects('getRequest').once().withExactArgs(id, service, sinon.match.object);
		expPersistentIncrementRequest = persistenceMock.expects('incrementRequest').once().withExactArgs(id, service, sinon.match.object);
		expPersistentClearRequest = persistenceMock.expects('clearRequest').once().withExactArgs(id, service);

		var fakeFactory = {
			getPersistence: function() {
				return persistence;
			}
		};
		sut = new RequestMeter(fakeFactory);
	});

	suite('#get', function(){
		test('Should call Persistence.getRequest with id, service and callback', function(){
			sut.get(id, service, {});
			expPersistenceGetRequest.verify();
		});
	});

	suite('#increment', function(){
		test('Should call Persistence.incrementRequest with id, service and callback', function(){
			sut.increment(id, service, {});
			expPersistentIncrementRequest.verify();
		});
	});

	suite('#clear', function(){
		test('Should call Persistence.clearRequest with id, service and callback', function(){
			sut.clear(id, service, {});
			expPersistentClearRequest.verify();
		});
	});
});
