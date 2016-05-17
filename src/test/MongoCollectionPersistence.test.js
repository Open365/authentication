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

var MongoPersistence = require('../lib/captcha/persistence/mongo');
var Settings = require('../lib/settings');
var MongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;
var MongoDriver = require('eyeos-mongo').MongoDriver;
var mongoose = require('mongoose');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');
var FakeMongoCollection = require('./utils/FakeMongoCollection');

suite('MongoCollectionPersistence', function () {
    var sut, id, text, newDate, dataForSave, dataForValidate,
		persistenceAsyncHandler, persistenceAsyncHandlerMock, persistenceAsyncHandlerValidateDoneExp,
		mongoDriverSingletonMock,
        fakeCollection, collectionMock,
		types, typesMock;
    setup(function () {
		id = "fake id";
        text = "a text for a test";
		dataForValidate = { id: id, text: text };

		fakeCollection = FakeMongoCollection.FakeMongoCollection;
		collectionMock = sinon.mock(fakeCollection);

		mongoDriverSingletonMock = sinon.mock(MongoDriverSingleton);

		types = mongoose.Types;
		typesMock = sinon.mock(types);

		persistenceAsyncHandler = new PersistenceAsyncHandler();
		persistenceAsyncHandlerMock = sinon.mock(persistenceAsyncHandler);
		persistenceAsyncHandlerValidateDoneExp = persistenceAsyncHandlerMock.expects('validateDone').once().withExactArgs(false);

		sut = new MongoPersistence(MongoDriverSingleton, types);
    });

	teardown(function () {
		collectionMock.restore();
		mongoDriverSingletonMock.restore();
		typesMock.restore();
	});

	suite('when there\'s no collection', function () {
		var mongoDriverSingletonGetMongoDriverExp, mongoDriver, mongoDriverMock, mongoDriverGetCollectionExp;
		setup(function () {
			mongoDriver = new MongoDriver();
			mongoDriverMock = sinon.mock(mongoDriver);
			mongoDriverGetCollectionExp = mongoDriverMock.expects('getCollection').once().withExactArgs(Settings.captcha.validationStorage.persistence.collection).returns(fakeCollection);

			mongoDriverSingletonGetMongoDriverExp = mongoDriverSingletonMock.expects('getMongoDriver').once().withExactArgs().returns(mongoDriver);
		});
		suite("save", function () {
			test('calls to MongoDriverSingleton.getMongoDriver', function () {
				sut.save(persistenceAsyncHandler, text, newDate);
				mongoDriverSingletonGetMongoDriverExp.verify();
			});
			test('calls to mongoDriver.getCollection', function () {
				sut.save(persistenceAsyncHandler, text, newDate);
				mongoDriverGetCollectionExp.verify();
			});
		});
		suite("#validate", function () {
			test('calls to MongoDriverSingleton.getMongoDriver', function () {
				sut.validate(persistenceAsyncHandler, dataForValidate);
				mongoDriverSingletonGetMongoDriverExp.verify();
			});
			test('calls to mongoDriver.getCollection', function () {
				sut.validate(persistenceAsyncHandler, dataForValidate);
				mongoDriverGetCollectionExp.verify();
			});
		});
	});

	suite('when there\'s a collection', function (){
		var collectionInsertExp, typesObjectIdExp, collectionFindExp;
		setup(function () {
			sut.collection = fakeCollection;
		});
		suite("#save", function () {
			setup(function () {
				newDate = new Date();
				dataForSave = { createdAt: newDate, text: text };

				collectionInsertExp = collectionMock.expects('insert').once().withExactArgs(dataForSave, sinon.match.func);
			});
			test('calls to collection.insert', function () {
				sut.save(persistenceAsyncHandler, text, newDate);
				collectionInsertExp.verify();
			});
		});
		suite("#validate", function () {
			suite("when mongoose.Types.ObjectId goes ok", function () {
				setup(function () {
					typesObjectIdExp = typesMock.expects('ObjectId').once().withExactArgs(id).returns(id);
					collectionFindExp = collectionMock.expects('findOne').once().withExactArgs({ text: text, _id: id }, sinon.match.func);
				});
				test('calls to mongoose.Types.ObjectId', function () {
					sut.validate(persistenceAsyncHandler, dataForValidate);
					typesObjectIdExp.verify();
				});
				test('calls to collection.findOne', function () {
					sut.validate(persistenceAsyncHandler, dataForValidate);
					collectionFindExp.verify();
				});
			});
			suite("when mongoose.Types.ObjectId throws error", function () {
				test('calls to persistenceAsyncHandler.validateDone', function () {
					var err = new Error('test ObjectId error');
					typesObjectIdExp = typesMock.expects('ObjectId').once().withExactArgs(id).throws(err);
					sut.validate(persistenceAsyncHandler, dataForValidate);
					persistenceAsyncHandlerValidateDoneExp.verify();
				});
			});
		});
	});

});
