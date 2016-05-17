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
var MongoDriver = require('eyeos-mongo').MongoDriver;
var MongoPersistence = require('../lib/login/persistence/mongo/MongoPersistence');
var MongoPersistenceCallback = require('../lib/login/persistence/mongo/MongoPersistenceCallback');
var settings = require('../lib/settings-test.js');

suite('MongoPersistence', function () {
	var sut;
	var mongoDriver, mongoDriverMock;
	var mongoPersistenceCallbackMock;
	var expGetCollection, expFetchedCallback, expCollectionFindOne;
	var expCollectionUpdate, expIncrementedCallback;
	var expCollectionRemove;
	var functionToMock = function() {};
	var functionMock;
	var collectionMock;
	var fakeCollection = {
		findOne: function() {},
		update: function() {},
		remove: function() {},
		ensureIndex: function() {}
	};

	var userId = '1', serviceId = 'myservice';
	var query = {userId: userId, serviceId: serviceId};
	var document = {$inc: {request: 1}};
	var opts = {upsert: true};

	var fakeCallback = function(){};

	setup(function () {

		mongoDriver = new MongoDriver();
		mongoDriverMock = sinon.mock(mongoDriver);

		collectionMock = sinon.mock(fakeCollection);

		functionMock = sinon.mock(functionToMock);

		mongoPersistenceCallbackMock = sinon.mock(MongoPersistenceCallback);

		expFetchedCallback = mongoPersistenceCallbackMock
										.expects('requestFetchedCallback')
										.once().withExactArgs(sinon.match.object)
										.returns(fakeCallback);
		expIncrementedCallback = mongoPersistenceCallbackMock
										.expects('requestIncrementedCallback')
										.once().withExactArgs(sinon.match.object)
										.returns(fakeCallback);
		expGetCollection = mongoDriverMock.expects('getCollection').once().withExactArgs('requestMeter').returns(fakeCollection);
		expCollectionFindOne = collectionMock.expects('findOne').once().withExactArgs(query, sinon.match.func);
		expCollectionUpdate = collectionMock.expects('update').once().withExactArgs(query, document, opts, sinon.match.func);
		expCollectionRemove = collectionMock.expects('remove').once().withExactArgs(query, sinon.match.func);

		sut = new MongoPersistence(mongoDriver, MongoPersistenceCallback);
	});

	teardown(function() {
		collectionMock.restore();
		mongoPersistenceCallbackMock.restore();
	});

	suite('getRequest', function () {
		test('Should call this.getCollection', function () {
			var sutGetCollectionSpy = sinon.spy(sut, 'getCollection');
			sut.getRequest(userId, serviceId);
			assert.isTrue(sutGetCollectionSpy.calledOnce);
			sutGetCollectionSpy.restore();
		});
		test('Should call collection.findOne with query as first argument and callback as second', function () {
			sut.getRequest(userId, serviceId);
			expCollectionFindOne.verify();
		});
		test('Should call MongoPersistenceCallback.requestFetchedCallback', function () {
			sut.getRequest(userId, serviceId);
			expFetchedCallback.verify();
		});
	});

	suite('#incrementRequest', function(){
		test('Should call this.getCollection', function () {
			var sutGetCollectionSpy = sinon.spy(sut, 'getCollection');
			sut.getRequest(userId, serviceId);
			assert.isTrue(sutGetCollectionSpy.calledOnce);
			sutGetCollectionSpy.restore();
		});
		test('Should call collection.update with query, document, options and callback as arguments', function () {
			sut.incrementRequest(userId, serviceId);
			expCollectionUpdate.verify();
		});
		test('Should call MongoPersistenceCallback.requestIncementedCallback', function () {
			sut.incrementRequest(userId, serviceId);
			expIncrementedCallback.verify();
		});
	});

	suite('#clearRequest', function(){
		test('Should call this.getCollection', function () {
			var sutGetCollectionSpy = sinon.spy(sut, 'getCollection');
			sut.getRequest(userId, serviceId);
			assert.isTrue(sutGetCollectionSpy.calledOnce);
			sutGetCollectionSpy.restore();
		});
		test('Should call collection.remove with query and callback as arguments', function () {
			sut.clearRequest(userId, serviceId);
			expCollectionRemove.verify();
		});
	});

	suite('#getCollection', function(){
		test('Should call mongoDriver.getCollection only first time', function(){
			sut.getCollection();
			expGetCollection.verify();
			sut.getCollection();
			expGetCollection.verify();
		});
		test('Should call collection.ensureIndex on userId', function(){
			var expEnsureIndex = collectionMock.expects('ensureIndex').once().withExactArgs('userId', sinon.match.func).returns(fakeCollection);
			sut.getCollection();
			expEnsureIndex.verify();
			sut.getCollection();
			expEnsureIndex.verify();
		});
	});
});
