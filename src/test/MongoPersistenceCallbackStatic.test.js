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

var MongoPersistenceCallback = require('../lib/login/persistence/mongo/MongoPersistenceCallback');

suite('MongoPersistenceCallbackStatics', function(){
	var sut;
	var mongoPersistenceCallback, mongoPersistenceCallbackMock;
	var expRequestFetched, expRequestIncremented, expRequestCleared;

	var err = 'foo', result = 'bar';

	setup(function(){
		mongoPersistenceCallback = new MongoPersistenceCallback({});
		mongoPersistenceCallbackMock = sinon.mock(mongoPersistenceCallback);
		expRequestFetched = mongoPersistenceCallbackMock.expects('requestFetched').once().withExactArgs(err, result);
		expRequestCleared = mongoPersistenceCallbackMock.expects('requestCleared').once().withExactArgs(err, result);
		expRequestIncremented = mongoPersistenceCallbackMock.expects('requestIncremented').once().withExactArgs(err, result);

		sut = MongoPersistenceCallback;
	});

	suite('#requestFetchedCallback', function(){
		test('Should return a function', function(){
			var returnedFunction = sut.requestFetchedCallback(mongoPersistenceCallback);
			assert.isFunction(returnedFunction);
		});
		test('Returned function should call requestFetched', function () {
			var returnedFunction = sut.requestFetchedCallback(mongoPersistenceCallback);
			returnedFunction(err, result);
			expRequestFetched.verify();
		});
	});
	suite('#requestIncrementedCallback', function(){
		test('Shoul return a function', function(){
			var returnedFunction = sut.requestIncrementedCallback(mongoPersistenceCallback);
			assert.isFunction(returnedFunction);
		});

		test('Returned function should call requestIncremented', function () {
			var returnedFunction = sut.requestIncrementedCallback(mongoPersistenceCallback);
			returnedFunction(err, result);
			expRequestIncremented.verify();
		});
	});
	suite('#requestClearedCallback', function(){
		test('Should return a function', function(){
			var returnedFunction = sut.requestClearedCallback(mongoPersistenceCallback);
			assert.isFunction(returnedFunction);
		});
		test('Returned function should call requestCleared', function () {
			var returnedFunction = sut.requestClearedCallback(mongoPersistenceCallback);
			returnedFunction(err, result);
			expRequestCleared.verify();
		});
	});
});