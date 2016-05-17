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
var StaticCacheProvider = require('../lib/captcha/persistence/static-cache/StaticCachePersistence');
var request = require('request');
var settings = require('../lib/settings-test');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler.js')

suite('StaticCacheProvider', function () {
    var sut, fakeBlob, fakeUrl,
        requestMock, requestPostExp, callExp,
        persistenceAsyncHandler, persistenceAsyncHandlerMock, persistenceAsyncHandlerExpect;

    setup(function () {
        fakeBlob = {'toString': function() {return "BIG BLOB!!"}};
        fakeUrl = settings.captcha.blobStorage.persistence.url + ':' + settings.captcha.blobStorage.persistence.port + '/items';
        var callback = function () {},
            mock = sinon.mock(callback);
        requestMock = sinon.mock(request);
        var postParams = {
            url: fakeUrl,
            form: {
               blob: "BIG BLOB!!",
               mimetype: settings.captcha.mimetype,
               expiration: settings.captcha.blobStorage.persistence.expiration
            }
        };

        requestPostExp = requestMock.expects('post').once().withExactArgs(postParams, sinon.match.func);
        callExp = mock.expects('call').once();
        sut = new StaticCacheProvider(request, settings, callback);
    });

    teardown(function () {
        requestMock.restore();
    });

    suite('#save', function () {
        test('calls to request.post', function () {
            sut.save(persistenceAsyncHandler,fakeBlob);
            requestPostExp.verify();
        });
    });

});
