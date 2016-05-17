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

var MongoIdExtractor = require('../lib/captcha/persistence/mongo/MongoIdExtractor');
var MongoCollectionEnsureIndexSetter = require('../lib/captcha/persistence/mongo/MongoCollectionEnsureIndexSetter');
var Settings = require('../lib/settings-test');
var FakeMongoCollection = require('./utils/FakeMongoCollection');

suite('MongoCollectionEnsureIndexSetter', function () {
	var sut, err,
		persistenceAsyncHandler, docs,
		collection, collectionMock, collectionEnsureIndexExp,
		mongoIdExtractor;
	setup(function () {
		err = "an error to pass";

		mongoIdExtractor = new MongoIdExtractor();

		collection = FakeMongoCollection.FakeMongoCollection;
		collectionMock = sinon.mock(collection);
		collectionEnsureIndexExp = collectionMock.expects('ensureIndex').once().withExactArgs({ "createdAt": 1 }, { expireAfterSeconds: Settings.captcha.validationStorage.persistence.expireAfterSeconds }, sinon.match.func);

		sut = new MongoCollectionEnsureIndexSetter(Settings.captcha.validationStorage.persistence);
	});

	teardown(function () {
		collectionMock.restore();
	});

	suite('#set', function () {
		test('calls to collection.ensureIndex', function () {
			sut.set(collection, mongoIdExtractor, persistenceAsyncHandler, err, docs);
			collectionEnsureIndexExp.verify();
		});
	});

});
