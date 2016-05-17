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

var MongoIdExtractor = require('../lib/captcha/persistence/mongo/MongoIdExtractor');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');

suite('MongoIdExtractor', function () {
    var sut, id, err, docs,
		persistenceAsyncHandler, persistenceAsyncHandlerMock, persistenceAsyncHandlerValidationStorageDoneExp;

    setup(function () {
		err = 'a test error ';
        id = "an id";
		docs = [{ _id: id }];

        persistenceAsyncHandler = new PersistenceAsyncHandler();
        persistenceAsyncHandlerMock = sinon.mock(persistenceAsyncHandler);
        persistenceAsyncHandlerValidationStorageDoneExp = persistenceAsyncHandlerMock.expects('validationStorageDone').once().withExactArgs(id);

		sut = new MongoIdExtractor();
    });

    suite('#extract', function () {
        test('calls persistenceAsyncHandler.validationStorageDone', function () {
            sut.extract(persistenceAsyncHandler, docs, err);
            persistenceAsyncHandlerValidationStorageDoneExp.verify();
        });
    });

});
