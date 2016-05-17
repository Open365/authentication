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

var PersistenceManager = require('../lib/captcha/PersistenceManager');
var ValidationStorage = require('../lib/captcha/ValidationStorage');
var BlobStorage = require('../lib/captcha/BlobStorage');
var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');

suite("PersistenceManager", function () {
	var sut, responseFinisher,
        persistenceAsyncHandler, persistenceAsyncHandlerMock, persistenceAsyncHandlerSetExp;
	var validationStorage, validationStorageMock,
		blobStorage,
		text, blob, id, url, data;

	setup(function () {
        responseFinisher = "a responseFinisher instance";
		id = "fake id";
        url = "fake://URL";
        text = "fakeText";
        blob = "BIG BLOB!!!!";

        persistenceAsyncHandler = new PersistenceAsyncHandler();
        persistenceAsyncHandlerMock = sinon.mock(persistenceAsyncHandler);
		persistenceAsyncHandlerSetExp = persistenceAsyncHandlerMock.expects('setResponseFinisher').once().withExactArgs(responseFinisher);

		blobStorage = new BlobStorage();

		validationStorage = new ValidationStorage();
		validationStorageMock = sinon.mock(validationStorage);

		sut = new PersistenceManager(validationStorage, blobStorage, persistenceAsyncHandler);
	});

	suite("#store", function () {
		var blobStorageMock, blobStorageSaveExp, validationStorageSaveExp;
		setup(function () {
			data = {
				text: text,
				blob: blob
			};
			blobStorageMock = sinon.mock(blobStorage);
			blobStorageSaveExp = blobStorageMock.expects('save').once().withExactArgs(persistenceAsyncHandler, blob);
			validationStorageSaveExp = validationStorageMock.expects('save').once().withExactArgs(persistenceAsyncHandler, text);
		});
        test("calls responseFinisher.setResponseFinisher", function () {
            sut.store(responseFinisher, data);
            persistenceAsyncHandlerSetExp.verify();
        });
		test("calls to validationStorage.save with text", function () {
			sut.store(responseFinisher, data);
			validationStorageSaveExp.verify();
		});
		test("calls blobStorage.save with blob", function () {
			sut.store(responseFinisher, data);
			blobStorageSaveExp.verify();
		});
	});

	suite("#validate", function () {
		var validationStorageValidateExp;
		setup(function () {
			data = {};
			validationStorageValidateExp = validationStorageMock.expects('validate').once().withExactArgs(persistenceAsyncHandler, data);
		});
		test("calls responseFinisher.setResponseFinisher", function () {
			sut.validate(responseFinisher, data);
			persistenceAsyncHandlerSetExp.verify();
		});
		test("calls validationStorage.validate", function () {
			sut.validate(responseFinisher, data);
			validationStorageValidateExp.verify();
		});
	});
});
