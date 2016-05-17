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

var PrincipalProvider = require('../lib/principals/PrincipalProvider');
var settings = require('../lib/settings');

suite('PrincipalProvider', function () {
	var sut, principal, expFindOne, userId = 'testUser', principalProviderV2, user = 'test';
	var query, action, callback;

	//a fake user to return from mongoose mock
	var fakeUser;
	var userDoc;
	var PrincipalSingleton;
	var systemsGroupProviderMock;
	var systemGroupsArray = ['a', 'b'];
	var systemGroups;

	var systemsGroupProviderFake = {
		getAllIn: function(arr, cb){cb(null, [])}
	};

	setup(function () {
		PrincipalSingleton = {
			getInstance: function () {
				return principal;
			}
		};

		//the doc to be used when calling findOne
		function returnUserDoc() {
			return userDoc;
		}

		systemGroups = ['54b6ac495c002aa75c1c511d','54b78dedbde2c3d7090a199d'];
		query = null;
		action = null;
		callback = null;
		fakeUser = {
			'permissions': ['test'],
			toObject: function(){return fakeUser;},
			systemGroups: systemGroupsArray
		};

		userDoc = {
			principalId: userId,
			toObject: returnUserDoc
		};

		systemsGroupProviderFake = {
			getAllIn: function(arr, cb){cb(null, [])},
			notify: function() {}
		};
	});

    suite('createPrincipal', function() {
        setup(function() {
			principalProviderV2 = {createPrincipal:function() {}};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake, {});
        });
        test("called with user, should call principalProviderV2 createPrincipal", function() {
			var stub = sinon.stub(principalProviderV2, 'createPrincipal');
			sut.createPrincipal(user, callback, principalProviderV2);
			sinon.assert.calledWithExactly(stub, user, callback, settings.administratorUsername, settings.mustChangePassword);
        });
    });

	suite('getPrincipal', function () {
		//setup(generalSetup);

		test('Should check if the user exists before creating it', function(){
			principal = {
				findOne: function() {}
			};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);
			var principalMock = sinon.mock(principal);
			expFindOne = principalMock.expects('findOne').once().withArgs(sinon.match.has('principalId'));
			sut.getPrincipal(userId);
			expFindOne.verify();
			principalMock = null;
		});

		test('Should return the user, if it exists', function(done){
			principal = {
				findOne: function(query, cb) {cb(false,fakeUser)}
			};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);
			sut.getPrincipal(userId, function(ret) {
				assert.deepEqual(ret, fakeUser);
				done();
			});
		});

		test('Should call systemGroupsProvider.getAllIn to get all systemgroups details', function(){
			principal = {
				findOne: function(query, cb) {cb(false,fakeUser)}
			};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);
			systemsGroupProviderMock = sinon.mock(systemsGroupProviderFake);
			var expectSystGroupProvGetAllIn = systemsGroupProviderMock.expects('getAllIn').once().withExactArgs(systemGroupsArray, sinon.match.func);

			sut.getPrincipal(userId);

			expectSystGroupProvGetAllIn.verify();
		});
	});

	suite('addSystemGroups', function () {
		test('Should call Principal update with correct values', function() {
			principal = {
				update: function(providedQuery, providedAction, providedCallback) {
					query = providedQuery;
					action = providedAction;
					callback = providedCallback;
					if (providedCallback){
						providedCallback(false);	
					} 
				}
			};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);
			sut.addSystemGroups(userId, systemGroups);
			assert.deepEqual(query, {principalId: userId});
			assert.deepEqual(action, {$addToSet: {systemGroups: {$each: systemGroups}}});
		});

		test('Should notify on systemgroups addition', function(){
			principal = {
				update: function(providedQuery, providedAction, providedCallback) {
					query = providedQuery;
					action = providedAction;
					callback = providedCallback;
					if (providedCallback){
						providedCallback(false);	
					} 
				}
			};
			systemsGroupProviderMock = sinon.mock(systemsGroupProviderFake);
			var expectSystemGroupProviderNotify = systemsGroupProviderMock.expects('notify').once().withExactArgs(systemGroups);
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);

			sut.addSystemGroups(userId, systemGroups);

			expectSystemGroupProviderNotify.verify();
		});
	});

	suite('removeSystemGroups', function () {
		test('Should call Principal update with correct values', function () {
			principal = {
				update: function (providedQuery, providedAction, providedCallback) {
					query = providedQuery;
					action = providedAction;
					callback = providedCallback;
				}
			};
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);
			sut.removeSystemGroups(userId, systemGroups);
			assert.deepEqual(query, {principalId: userId});
			assert.deepEqual(action, {$pullAll: {systemGroups: systemGroups}});

		});

		test('Should notify on systemgroups removal', function(){
			principal = {
				update: function(providedQuery, providedAction, providedCallback) {
					query = providedQuery;
					action = providedAction;
					callback = providedCallback;
					if (providedCallback){
						providedCallback(false);	
					} 
				}
			};
			systemsGroupProviderMock = sinon.mock(systemsGroupProviderFake);
			var expectSystemGroupProviderNotify = systemsGroupProviderMock.expects('notify').once().withExactArgs(systemGroups);
			sut = new PrincipalProvider(PrincipalSingleton, systemsGroupProviderFake);

			sut.removeSystemGroups(userId, systemGroups);

			expectSystemGroupProviderNotify.verify();
		});
	});

	suite('setAndUpdateSystemGroupsFromDb', function () {
		test('Should call toObject to object found in Mongo.', function(){
			var principalfromDBFake = {
				toObject: function() {}
			};

			var expToObject = sinon.mock(principalfromDBFake).expects('toObject').once().withExactArgs().returns({});
			sut.setAndUpdateSystemGroupsFromDb(principalfromDBFake, function() {});

			expToObject.verify();

		});

		test('Should call the callback function with the principalObject.', function(){
			var principalfromDBFake = {
				toObject: function() {return {}}
			};

			var callbackStub = sinon.stub();
			sut.setAndUpdateSystemGroupsFromDb(principalfromDBFake, callbackStub);

			assert(callbackStub.calledOnce);
			assert(callbackStub.calledWithExactly(sinon.match({})));
		});

		test('Should not save the object if the system groups match', function(){
			var principalfromDBFake = {
				toObject: function() {return {}},
				save: function() {},
				systemGroups: systemGroupsArray
			};

			var expNeverSave = sinon.mock(principalfromDBFake).expects('save').never();
			sut.setAndUpdateSystemGroupsFromDb(principalfromDBFake, function() {}, null, systemGroupsArray);

			expNeverSave.verify();
		});

		test('Should save the object if the system groups are different', function(){
			var principalfromDBFake = {
				toObject: function() {return {}},
				save: function() {},
				systemGroups: systemGroupsArray
			};

			var expDoSave = sinon.mock(principalfromDBFake).expects('save').once();
			sut.setAndUpdateSystemGroupsFromDb(principalfromDBFake, function() {}, null, []);

			expDoSave.verify();
		});
	});
});
