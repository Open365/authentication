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
var SuccessfulLoginPostProcessor = require('../lib/SuccessfulLoginPostProcessor');
var Client = require('eyeos-consume-service').Client;
var EyeCrypt = require('eyeos-crypt').EyeCrypt;

suite("SuccessfulLoginPostProcessor", function () {
    var sut, settings, consumeServiceStub;
	var eyeCrypt;

	var clock;
	var callback = sinon.spy();

	var username = 'aUser';
	var password = 'secretPass';
	var encryptedPassword = 'encryptedThings';
	var card = 'card';
	var signature = 'signature';
	var principal = {
		'firstName': 'John',
		'lastName': 'Doe'
	}

	var consumeService;

    setup(function () {
        settings =  {
			exchange: {
				postUrl: 'amqp.exchange.login://presence/v1/userEvent/login/',
				type: "amqp",
				host: 'rabbit.service.consul',
				port: 5672,
				options:  {
					durable: true,
					exclusive: false,
					autoDelete:false
				}
			}
		};

		clock = sinon.useFakeTimers(999);
		eyeCrypt = new EyeCrypt();
		sinon.stub(eyeCrypt);

		consumeService = new Client(settings);
		sinon.stub(consumeService);

		sut = new SuccessfulLoginPostProcessor(settings, consumeService, eyeCrypt);
    });

	teardown(function() {
		clock.restore();
	});

    suite("#success", function () {
		test('Should call EyeCrypt.encrypt passing the password and a callback', function () {
			sut.success(username, password, card, signature);
			sinon.assert.calledWithExactly(eyeCrypt.encrypt, password, sinon.match.func);
		});
		test('Should call consumeService.post with a msg containing the encrypted password', function () {
			eyeCrypt.encrypt.yields(false, encryptedPassword);
			sut.success(username, password, card, signature);

			var headers = {card: JSON.stringify(card), signature: signature};
			var msg = JSON.stringify({username: username, password: encryptedPassword, card: card, signature: signature, fullName: null, loginTs: Date.now()});
			sinon.assert.calledWithExactly(consumeService.post, settings.exchange.postUrl, headers, msg);
		});
		test('Should call consumeService.post with a msg containing the full name if provided', function () {
			eyeCrypt.encrypt.yields(false, encryptedPassword);
			sut.success(username, password, card, signature, principal);

			var headers = {card: JSON.stringify(card), signature: signature};
			var msg = JSON.stringify({username: username, password: encryptedPassword, card: card, signature: signature, fullName: 'John Doe', loginTs: Date.now()});
			sinon.assert.calledWithExactly(consumeService.post, settings.exchange.postUrl, headers, msg);
		});
    });
});