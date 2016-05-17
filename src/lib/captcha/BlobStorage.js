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

var BlobStorage = function (persistenceFactory) {
    this.persistenceFactory = persistenceFactory || new PersistenceFactory('blobStorage');
	this.logger = log2out.getLogger('CaptchaGenerator');
};

BlobStorage.prototype = {
	save: function (persistenceAsyncHandler, blob) {
		this.logger.debug('Save captcha image into the blob storage');
		if (!this.persistence) {
            this.persistence = this.persistenceFactory.getPersistence();
        }
        this.persistence.save(persistenceAsyncHandler, blob);
	}
};

module.exports = BlobStorage;
