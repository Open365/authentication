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

var PersistenceAsyncHandler = require('../lib/captcha/PersistenceAsyncHandler');
var ResponseFinisher = require('../lib/ResponseFinisher');

suite('PersistenceAsyncHandler', function () {
    var sut, result, id, url, res,
        responseFinisher, responseFinisherMock, responseFinisherEndExp;
    setup(function () {
        responseFinisher = new ResponseFinisher();
        responseFinisherMock = sinon.mock(responseFinisher);
        sut = new PersistenceAsyncHandler();
        sut.setResponseFinisher(responseFinisher);
    });

    suite('assert responseFinisher.end is called', function () {
        setup(function () {
            id = "test id";
            url = "test url";
			res = "test result";
            result = {
                result: {
                    id: id,
                    url: url
                }
            };
        });
        test('#validationStorageDone when url is set', function () {
			responseFinisherEndExp = responseFinisherMock.expects('end').once().withExactArgs(result);
            sut.result["result"]["url"] = url;
            sut.validationStorageDone(id);
            responseFinisherEndExp.verify();
        });
        test('#blobStorageDone when id is set', function () {
			responseFinisherEndExp = responseFinisherMock.expects('end').once().withExactArgs(result);
            sut.result["result"]["id"] = id;
            sut.blobStorageDone(url);
            responseFinisherEndExp.verify();
        });
		test('#validateDone when id is set', function () {
			result = { result: { success: res} };
			responseFinisherEndExp = responseFinisherMock.expects('end').once().withExactArgs(result);
			sut.result["result"]["success"] = res;
			sut.validateDone(res);
			responseFinisherEndExp.verify();
		});
    });

    suite('assert responseFinisher.end is not called', function () {
        setup(function () {
            responseFinisherEndExp = responseFinisherMock.expects('end').never();
        });
        test('#validationStorageDone when url is not set', function () {
            sut.validationStorageDone(id);
            responseFinisherEndExp.verify();
        });
        test('#blobStorageDone when id is not set', function () {
            sut.blobStorageDone(url);
            responseFinisherEndExp.verify();
        });
    });

});
