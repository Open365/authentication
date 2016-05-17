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

var ValidationStorage = require('../lib/captcha/ValidationStorage');
var DummyPersistence = require('../lib/captcha/persistence/dummy');

suite("Validation Storage", function () {
	var sut, text, persistenceAsyncHandler,
		fakeFactoryMock, fakeFactoryGetPersistenceExp, fakeFactoryNeverGetPersistenceExp,
        dummyPersistence, dummyPersistenceMock, dummyPersistenceSaveExp;

	setup(function () {
        text = "a test text";
        persistenceAsyncHandler = "a persistenceAsyncHandler instance";
        dummyPersistence = new DummyPersistence();
        dummyPersistenceMock = sinon.mock(dummyPersistence);
        dummyPersistenceSaveExp = dummyPersistenceMock.expects('save').once().withExactArgs(persistenceAsyncHandler, text);

        var fakeFactory = {
            getPersistence: function () {
                return dummyPersistence;
            }
        };
		fakeFactoryMock = sinon.mock(fakeFactory);
		fakeFactoryGetPersistenceExp = fakeFactoryMock.expects('getPersistence').once().withExactArgs().returns(dummyPersistence);
		fakeFactoryNeverGetPersistenceExp = fakeFactoryMock.expects('getPersistence').never().withExactArgs();
		sut = new ValidationStorage(fakeFactory);
	});

	suite("#save", function () {
		test("calls to persistence.save", function () {
            sut.save(persistenceAsyncHandler, text);
            dummyPersistenceSaveExp.verify();
        });
		test("calls to persistenceFactory.getPersistence when persistence does not exist", function () {
            sut.save(persistenceAsyncHandler, text);
			fakeFactoryGetPersistenceExp.verify();
        });
		test("cannot call to persistenceFactory.getPersistence when persistence exists", function () {
			sut.save(persistenceAsyncHandler, text);
			fakeFactoryNeverGetPersistenceExp.verify();
		});
	});

	suite("#validate", function () {
		test("calls to persistenceFactory.getPersistence when persistence does not exist", function () {
			sut.validate(persistenceAsyncHandler, text);
			fakeFactoryGetPersistenceExp.verify();
		});
		test("cannot call to persistenceFactory.getPersistence when persistence exists", function () {
			sut.validate(persistenceAsyncHandler, text);
			fakeFactoryNeverGetPersistenceExp.verify();
		});
	});
});
