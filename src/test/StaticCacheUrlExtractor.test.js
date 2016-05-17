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

var StaticCacheUrlExtractor = require('../lib/captcha/persistence/static-cache/StaticCacheUrlExtractor.js');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');

suite('StaticCacheUrlExtractor', function () {
    var sut, url, err, docs,
        persistenceAsyncHandler, persistenceAsyncHandlerMock,
        persistenceAsyncHandlerBlobStorageDoneExp, persistenceAsyncHandlerPersistenceFailed;

    setup(function () {
        url = "url";
        var message = 'a error message';
        err = new Error(message);

        persistenceAsyncHandler = new PersistenceAsyncHandler();
        persistenceAsyncHandlerMock = sinon.mock(persistenceAsyncHandler);
        persistenceAsyncHandlerBlobStorageDoneExp = persistenceAsyncHandlerMock.expects('blobStorageDone').once().withExactArgs(url);
        persistenceAsyncHandlerPersistenceFailed = persistenceAsyncHandlerMock.expects('persistenceFailed').once().withExactArgs(err);
        sut = new StaticCacheUrlExtractor();
    });

    suite('#extract', function () {
        test('when error calls persistenceAsyncHandler.persistenceFailed', function () {
            sut.extract(persistenceAsyncHandler, err, docs, url);
            persistenceAsyncHandlerPersistenceFailed.verify();
        });

        test('when not error calls persistenceAsyncHandler.StaticCacheUrlExtractor', function () {
            sut.extract(persistenceAsyncHandler, null, null, url);
            persistenceAsyncHandlerBlobStorageDoneExp.verify();
        });
    });

});
