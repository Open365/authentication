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
var WebServer = require('eyeos-restutils').Server;
var ServerStarter = require('../lib/ServerStarter');
var AuthenticationRestControllerFactory = require('../lib/AuthenticationRestControllerFactory');

suite('ServerStarter', function(){
	var sut;
	var webServer, webServerMock;
	var expServerListen;

	setup(function(){
		webServer = new WebServer();
		webServerMock = sinon.mock(webServer);
		expServerListen = webServerMock.expects('start').thrice().withExactArgs();

		sut = new ServerStarter(webServer);
	});

	suite('#setMongoStarted', function(){
		test('If passed argument is true, mongoStarted counter should increase by 1)', function(){
			sut.setMongoStarted(true);
			assert.equal(1, sut.mongoStarted);
		});
		test('Should call webServer.start thrice if sut.mongoStarted is equal to this.neededMongostarted.', function () {
			sut.mongoStarted = sut.neededMongostarted - 1;
			sut.setMongoStarted(true);
			expServerListen.verify();
		});
	});
});
