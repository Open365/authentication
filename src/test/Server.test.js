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
var Server = require('../lib/Server');
var settings = require('../lib/settings-test');
var ServerStarter = require('../lib/ServerStarter');
var MongooseSetup = require('../lib/MongooseSetup');
var mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;
var ExtraKProvider = require('../lib/login/ExtraKProvider');

suite('Server', function(){
	var sut;
	var mongoSingletonMock;
	var expMongoSingleGet;

	var mongooseSetup;

	var serverStarter, serverStarterMock;
	var expServerStarterSetMongo;
	var extraKProviderInitializeExtraKStub;

	setup(function(){
		mongooseSetup = new MongooseSetup();
		sinon.stub(mongooseSetup, 'start', function(callback) {
			callback(true);
		});

		serverStarter = new ServerStarter();
		serverStarterMock = sinon.mock(serverStarter);
		expServerStarterSetMongo = serverStarterMock.expects('setMongoStarted').once().withExactArgs(true);

		extraKProviderInitializeExtraKStub = sinon.stub(ExtraKProvider, 'initializeExtraK');

		mongoSingletonMock = sinon.mock(mongoDriverSingleton);
		expMongoSingleGet = mongoSingletonMock.expects('connect').once().withExactArgs(sinon.match.object, settings);

		sut = new Server(serverStarter, settings, mongooseSetup, extraKProviderInitializeExtraKStub);
	});

	teardown(function() {
		extraKProviderInitializeExtraKStub.restore();
		mongoSingletonMock.restore();
	});

	suite('#start', function(){
		test('Should call mongoDriversingleton.connect', function () {
			sut.start();
			expMongoSingleGet.verify();
		});

		test('After setting up mongoose via MongooSetup, serverStarter.setMongoStarted should be called', function () {
			extraKProviderInitializeExtraKStub.callsArgWith(0, null);
			sut.start();
			expServerStarterSetMongo.verify();
		});

		test('ExtraKProvider initializeExtraK is called', function() {
			sut.start();
			sinon.assert.calledWithExactly(extraKProviderInitializeExtraKStub, sinon.match.func);
		});
	});
});
