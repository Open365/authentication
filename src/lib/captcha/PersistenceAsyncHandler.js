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

var log2out = require('log2out');

var PersistenceAsyncHandler = function () {
    this.result = {'result' : {}};
	this.logger = log2out.getLogger('PersistenceAsyncHandler');
};

PersistenceAsyncHandler.prototype.setResponseFinisher = function (responseFinisher) {
	this.responseFinisher = responseFinisher;
};

PersistenceAsyncHandler.prototype._done = function () {
	this.responseFinisher.end(this.result);
};

PersistenceAsyncHandler.prototype.validationStorageDone = function (id) {
	this.logger.debug("ValidationStorage done");
	this.result['result']["id"] = id;
	if (this.result['result']["url"]) {
		this._done();
	}
};

PersistenceAsyncHandler.prototype.blobStorageDone = function (url) {
	this.logger.debug("BlobStorage done");
	this.result['result']["url"] = url;
	if (this.result['result']["id"]) {
		this._done();
	}
};

PersistenceAsyncHandler.prototype.validateDone = function (result) {
	this.logger.debug("ValidateStorage done");
	this.result['result']["success"] = result;
	this._done();
};

PersistenceAsyncHandler.prototype.persistenceFailed = function (err) {
	this.result.err = err;
	return this._done();
};

module.exports = PersistenceAsyncHandler;
