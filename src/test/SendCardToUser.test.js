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
var SendCardToUser = require('../lib/permissions/SendCardToUser');

suite('SendCardToUser', function() {
    var sut;
    var restUtilsReplyFake;
    var memberId = 'dani.ametller';
    var aSignature = 'a-signature-fake';
    var cardFake;
    var domain = 'open365.io';
    var notificationControllerFake;

    setup(function () {
        restUtilsReplyFake = {
            end: sinon.spy(),
            fail: sinon.spy()
        };

        cardFake = {
            username: memberId,
            domain: domain
        };

        notificationControllerFake = {
            notifyUser: sinon.spy()
        };

        sut = new SendCardToUser(restUtilsReplyFake, notificationControllerFake);
    });

    suite('signed', function () {
        test('should end restUtilsReply with msg type: newCardAvailable', function () {
            sut.signed(cardFake, aSignature);

            sinon.assert.calledOnce(restUtilsReplyFake.end);
            sinon.assert.calledWithExactly(restUtilsReplyFake.end, sinon.match.string);

            var msg = JSON.parse(restUtilsReplyFake.end.firstCall.args[0]);
            console.log("MSG: ", msg);

            assert.equal(msg.type, 'newCardAvailable');
            assert.deepEqual(msg.data.card, cardFake);
            assert.equal(msg.data.signature, aSignature);
        });

        test('should notify user owning the card using user exchange', function () {
            var useUserExchange = true;

            sut.signed(cardFake, aSignature);

            sinon.assert.calledOnce(notificationControllerFake.notifyUser);
            sinon.assert.calledWithExactly(notificationControllerFake.notifyUser, sinon.match.object, memberId + '@' + domain, useUserExchange);
        });

        test('should notify user owning the card with expected data format', function () {
            sut.signed(cardFake, aSignature);

            sinon.assert.calledOnce(notificationControllerFake.notifyUser);

            var notification = notificationControllerFake.notifyUser.firstCall.args[0];

            assert.equal(notification.type, 'newCardAvailable');
            assert.deepEqual(notification.data.card, cardFake);
            assert.equal(notification.data.signature, aSignature);


        });
    });
});
