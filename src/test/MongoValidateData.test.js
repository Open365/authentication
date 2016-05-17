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

var MongoValidateData = require('../lib/captcha/persistence/mongo/MongoValidateData');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');
var FakeCollection = require('./utils/FakeMongoCollection');

suite("MongoValidateData", function () {
	var sut, result, err, mongoId,
		collection, collectionMock, collectionRemoveExp,
		persistenceAsyncHandler, persistenceAsyncHandlerMock, persistenceAsyncHandlerValidateDoneExp;
	setup(function () {
		result = "test result";
		err = "test error";
		mongoId = "test mongoId";

		collection = FakeCollection.FakeMongoCollection;
		collectionMock = sinon.mock(collection);
		collectionRemoveExp = collectionMock.expects('remove').once().withExactArgs({ _id: mongoId }, sinon.match.func);

		persistenceAsyncHandler = new PersistenceAsyncHandler();
		persistenceAsyncHandlerMock = sinon.mock(persistenceAsyncHandler);
		persistenceAsyncHandlerValidateDoneExp = persistenceAsyncHandlerMock.expects('validateDone').once().withExactArgs(true);

		sut = new MongoValidateData();
	});
	teardown(function () {
		collectionMock.restore();
	});

	suite("#validate", function () {
		test('calls to persistenceAsyncHandler.validateDone with false when item is not true', function () {
			persistenceAsyncHandlerValidateDoneExp = persistenceAsyncHandlerMock.expects('validateDone').once().withExactArgs(false);
			sut.validate(persistenceAsyncHandler, collection, mongoId, err, null);
			persistenceAsyncHandlerValidateDoneExp.verify();
		});
		test('calls to collection.remove when item exists', function () {
			sut.validate(persistenceAsyncHandler, collection, mongoId, err, true);
			collectionRemoveExp.verify();
		});
		test('calls to persistenceAsyncHandler.validateDone with true', function () {
			sut.validate(persistenceAsyncHandler, collection, mongoId, err, true);
			persistenceAsyncHandlerValidateDoneExp.verify();
		});
	});
});
