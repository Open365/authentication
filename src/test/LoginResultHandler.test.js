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

'use strict';
require('log2out').clearAppenders();

var sinon = require('sinon');
var assert = require('chai').assert;
var RequestMeter = require('../lib/login/RequestMeter');
var LoginResultHandler = require('../lib/login/LoginResultHandler');
var RequestLimit = require('../lib/login/RequestLimit');
var ResponseFinisher = require('../lib/ResponseFinisher');
var LoginResult = require('../lib/login/LoginResult');
var PrincipalProvider = require('../lib/principals/PrincipalProvider');
var CredentialsFactory = require('../lib/login/CredentialsFactory');
var log2out = require('log2out');

suite('LoginResultHandler', function(){
	var sut;
	var requestMeter, requestMeterMock,
		responseFinisher, responseFinisherMock;
    var credentialsFactory = new CredentialsFactory();
	var expRequestMeterClear;
	var requestLimit, requestLimitMock;
	var principalProvider, principalProviderMock;
    var userId = 'Userid23';
    var domain = 'some domain';
    var fullName;
    var credentials;
    var principal;
	var service = 'login';
	var expRequestLimitReached;
    var expReqMeterIncrement;
    var expReqFinisherEnd;
	var expReqFinisherConnectionError;
	var expPrincipalProviderUpdate;
	var TID = '550e8400-e29b-41d4-a716-446655440000';
	var tracer;
    var declareUserQueueFake;
    var queueFake;

	setup(function(){
		var usernameRequest = userId.toLowerCase();
		fullName = usernameRequest + '@' + domain;

		principal = {
			principalId: userId,
			domain: domain,
			permissions: []
		};
		credentials = credentialsFactory.getCredentials({type: "Basic", username: userId, password: "A password", domain: domain});
		requestLimit = new RequestLimit();
		principalProvider = new PrincipalProvider();
		principalProviderMock = sinon.mock(principalProvider);
		requestLimitMock = sinon.mock(requestLimit);
		responseFinisher = new ResponseFinisher();
		responseFinisherMock = sinon.mock(responseFinisher);
		requestMeter = {
            clear: function(){},
            increment: function(){},
			get: function() {}
        };
        queueFake = {name: 'faked.queue', close: sinon.spy()};
		requestMeterMock = sinon.mock(requestMeter);

		tracer = log2out.getLogger('LoginResultHandler');
        declareUserQueueFake = sinon.stub().yields(null, queueFake);

		sut = new LoginResultHandler(credentials, responseFinisher, requestMeter, requestLimit, principalProvider, tracer, declareUserQueueFake);

		expReqFinisherEnd = responseFinisherMock.expects('end').once().withExactArgs(sinon.match({status: 403}));
		expRequestLimitReached = requestLimitMock.expects('reached').once().withExactArgs(fullName, service, sinon.match.object);
		expRequestMeterClear = requestMeterMock.expects('clear').once().withExactArgs(fullName, service);
        expReqMeterIncrement = requestMeterMock.expects('increment').once().withExactArgs(fullName, service, sinon.match.object).yieldsTo("requestIncremented");
		expReqFinisherConnectionError = responseFinisherMock.expects('end').once().withExactArgs(sinon.match({err: 503}));
		expPrincipalProviderUpdate = principalProviderMock.expects('updatePrincipal').once().withExactArgs(principal, sinon.match.func);
	});

	suite('#invalidCredentials', function() {
        test('Should call requestMeter.reached if login is not successful', function () {
            sut.invalidCredentials(LoginResult.INVALID_CREDENTIALS);

            expRequestLimitReached.verify();
        });

        test('Should call requestMeter.increment if login is not successful', function () {
            sut.invalidCredentials(LoginResult.INVALID_CREDENTIALS);

            expReqMeterIncrement.verify();
        });

        test('Should call tracer.info with correct parameters', function(){
            var tries = 2;
            requestMeterMock.restore();
            sinon.stub(requestMeter, 'increment', function(id, type, callbacks) {
                callbacks.requestIncremented();
            });
            sinon.stub(requestMeter, 'get', function(id, type, callbacks) {
                callbacks.gotRequest(tries);
            });
            var tracerInfoStub = sinon.stub(tracer, 'info');
            sut.invalidCredentials(LoginResult.INVALID_CREDENTIALS, TID);
            assert(tracerInfoStub.calledWithExactly('User', fullName, 'Login failed! Number of tries:', tries, TID, 0), 'Tracer not called or called with invalid params');
        });
    });

    suite('#success - declareUserQueue==OK', function() {
        test('Should call requestMeter.clear if login is successful', function () {
            sut.success(principal);
            expRequestMeterClear.verify();
        });

        test('Should call principalProvider.updatePrincipal if login is successful', function () {
            sut.success(principal);
            expPrincipalProviderUpdate.verify();
        });

        test('Should call queue.close on userQueue to not leak amqp channels VDI-3731', function () {
            sut.success(principal);
            
            sinon.assert.calledOnce(queueFake.close);
        });

        test('Should declare user queue after successful login', function () {
            sut.success(principal);

            sinon.assert.calledOnce(declareUserQueueFake);
            sinon.assert.calledWith(declareUserQueueFake, principal.principalId.toLowerCase() + '@' + principal.domain );
        });
    });

    suite('#success - declareUserQueue==KO', function() {
        var responseFinisherFake;
        setup(function() {
            sinon.stub(process, 'exit').returns();

            declareUserQueueFake = sinon.stub().yields('Fake error declaring queue.', null);
            responseFinisherFake = {
                end: sinon.spy()
            };
            sut = new LoginResultHandler(credentials, responseFinisherFake, requestMeter, requestLimit, principalProvider, tracer, declareUserQueueFake);
        });

        teardown(function(){
            process.exit.restore();
        });

        test('Should call process.exit on queue declaration error', function () {
            sut.success(principal);

            sinon.assert.calledOnce(process.exit);
            sinon.assert.calledWithExactly(process.exit, 1);
        });

        test('Should call responseFinisher.end with error', function () {
            sut.success(principal);

            sinon.assert.calledOnce(responseFinisherFake.end);
            sinon.assert.calledWith(responseFinisherFake.end, sinon.match({err: new Error('err')}));
        });
    });

    suite('#error', function() {
        test('Should call responseFinisher with status: 503 on connection error', function(){
            sut.error(LoginResult.CONNECTION_ERROR);
            expReqFinisherConnectionError.verify();
        });
	});
});
