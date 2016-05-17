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
var BlobStorage = require('../lib/captcha/BlobStorage');
var Persistence = require('../lib/captcha/persistence/static-cache/');
var StaticCacheUrlExtractor = require('../lib/captcha/persistence/static-cache/StaticCacheUrlExtractor');

suite("BlobStorage", function () {
    var sut, fakeBlob, persistenceAsyncHandler,
        redisProvider, redisProviderMock, redisProviderSaveExp;

    setup(function () {
        persistenceAsyncHandler = "a persistenceAsyncHandler instance",
        fakeBlob = "BIG BLOB!!";
        redisProvider = new Persistence();
        redisProviderMock = sinon.mock(redisProvider);
        redisProviderSaveExp = redisProviderMock.expects('save').once().withExactArgs(persistenceAsyncHandler, fakeBlob);

        var fakeFactory = {
            getPersistence: function () {
                return redisProvider;
            }
        };
        sut = new BlobStorage(fakeFactory);
    });

    suite("#store", function () {
        test("calls to persistence.save", function () {
            sut.save(persistenceAsyncHandler, fakeBlob);
            redisProviderSaveExp.verify();
        });
    });
});
