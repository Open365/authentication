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

var PersistenceFactory = require('./persistence/PersistenceFactory');
var log2out = require('log2out');

var ValidationStorage = function (persistenceFactory) {
    this.persistence = null;
    this.persistenceFactory = persistenceFactory || new PersistenceFactory('validationStorage');
	this.logger = log2out.getLogger('ValidationStorage');
};

ValidationStorage.prototype._lazyGetPersistence = function () {
	if (!this.persistence) {
		this.persistence = this.persistenceFactory.getPersistence();
	}
};

ValidationStorage.prototype.save = function (persistenceAsyncHandler, text) {
	this.logger.debug('Save captcha text into validation storage');
	this._lazyGetPersistence();
	this.persistence.save(persistenceAsyncHandler, text);
};

ValidationStorage.prototype.validate = function (persistenceAsyncHandler, data) {
	this.logger.debug('Do validation storage to Validate the captcha text');
	this._lazyGetPersistence();
	this.persistence.validate(persistenceAsyncHandler, data);
};

module.exports =ValidationStorage;
