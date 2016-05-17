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

var MongoCollectionEnsureIndexSetter = function (settings) {
	this.settings = settings;
	this.logger = log2out.getLogger("MongoCollectionEnsureIndexSetter");
};

MongoCollectionEnsureIndexSetter.prototype.set = function (collection, mongoIdExtractor, persistenceAsyncHandler, err, docs) {
	if (err) {
		this.logger.warn(err);
	}
	collection.ensureIndex({ "createdAt": 1 }, { expireAfterSeconds: this.settings.expireAfterSeconds }, mongoIdExtractor.extract.bind(mongoIdExtractor, persistenceAsyncHandler, docs));
};

module.exports = MongoCollectionEnsureIndexSetter;
