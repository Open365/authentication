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
var StompClient = require('../lib/permissions/StompClient');
var UserNotificator = require('../lib/UserNotificator');
var settings = require('../lib/settings');

suite('UserNotificator', function(){
    var sut, stompClientSendStub;

	setup(function() {
		var stompClient = new StompClient(settings.userQueue);
		stompClientSendStub = sinon.stub(stompClient, 'send');
		sut = new UserNotificator(stompClient);
	});

	suite('#sendLoginSuccess', function(){
		test('Should call stompClient send with correct parameters', function () {
			var principalId = 'marc.monge';
			var transactionId = '550e8400-e29b-41d4-a716-446655440000';
			var destination = '/exchange/user_' + principalId;
			var msg = {
				type: "login",
				data: {
					transactionId: transactionId
				}
			};
			sut.sendLoginSuccess(principalId, transactionId);
			assert(stompClientSendStub.calledWithExactly(destination, msg));
		});
	});

});
