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

require('log2out').clearAppenders();

var sinon = require('sinon');
var assert = require('chai').assert;
var declareUserQueue = require('../lib/declareUserQueue');

suite("declareUserQueue", function () {
    var userQueueDeclarerFake;
    var username;
    suite("declareUserQueue-created-OK", function () {
        setup(function () {
            username = 'alan.turing';
            userQueueDeclarerFake = {
                declareUserQueue: sinon.stub().yieldsAsync(null, {name: 'queue.from.declarer.fake'})
            };
        });
        teardown(function () {
        });

        test("Should use queueDeclarer to create the user queue", function (done) {
            declareUserQueue(username, function (err, queue) {
                sinon.assert.calledOnce(userQueueDeclarerFake.declareUserQueue);
                done();
            }, userQueueDeclarerFake);
        });

        test("Should call back after creating the user queue", function () {
            var cb = sinon.spy(function (err, queue) {
                sinon.assert.called(cb);
                assert.isNull(err);
                assert.isNotNull(queue);
            });
            declareUserQueue(username, cb, userQueueDeclarerFake);
        });
    });

    suite("declareUserQueue-created-ERROR", function () {
        setup(function () {
            username = 'alan.turing';
            userQueueDeclarerFake = {
                declareUserQueue: sinon.stub().yieldsAsync("Error in fake declareUserQueue", null)
            };
        });
        teardown(function () {
        });

        test("Should call back with error when declareUserQueue has error and cb is provided", function (done) {
            declareUserQueue(username, function (err, queue) {
                sinon.assert.calledOnce(userQueueDeclarerFake.declareUserQueue);
                assert.isNotNull(err);
                done();
            }, userQueueDeclarerFake);
        });

        test("Should call declareUserQueue when not provided with optional callback", function (done) {
            declareUserQueue(username, null, userQueueDeclarerFake);
            sinon.assert.calledOnce(userQueueDeclarerFake.declareUserQueue);
            done();
        });
    });

});
