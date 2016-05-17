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

var Settings = require('../../../settings');
var MongoIdExtractor = require('./MongoIdExtractor');
var MongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;
var MongoCollectionEnsureIndexSetter = require('./MongoCollectionEnsureIndexSetter');
var MongoValidateData = require('./MongoValidateData');
var mongoose = require('mongoose');
var log2out = require('log2out');

var MongoCollectionPersistence = function (mongoDriver, types) {
	this.mongoIdExtractor = new MongoIdExtractor();
	this.collection = null;
	this.persistenceConfig = Settings.captcha.validationStorage.persistence;
	this.mongoDriverSingleton = mongoDriver || MongoDriverSingleton;
	this.mongoCollectionEnsureIndexSetter = new MongoCollectionEnsureIndexSetter(this.persistenceConfig);
	this.mongoValidateData = new MongoValidateData();
	this.types = types || mongoose.Types;
	this.logger = log2out.getLogger('MongoCollectionPersistence');
};

MongoCollectionPersistence.prototype._lazySetCollection = function () {
	if (!this.collection) {
		var mongoDriver = this.mongoDriverSingleton.getMongoDriver();
		this.collection = mongoDriver.getCollection(this.persistenceConfig.collection);
	}
};

MongoCollectionPersistence.prototype.save = function (persistenceAsyncHandler, text, date) {
	this._lazySetCollection();
	this.collection.insert({ createdAt: date || new Date(), text: text }, this.mongoCollectionEnsureIndexSetter.set.bind(this.mongoCollectionEnsureIndexSetter, this.collection, this.mongoIdExtractor, persistenceAsyncHandler));
};

MongoCollectionPersistence.prototype.validate = function (persistenceAsyncHandler, data) {
	this._lazySetCollection();
	try {
		var mongoId = this.types.ObjectId(data.id);
	} catch (err) {
		this.logger.warn(err.message);
		persistenceAsyncHandler.validateDone(false);
	}
	this.collection.findOne({ text: data.text, _id: mongoId }, this.mongoValidateData.validate.bind(this.mongoValidateData, persistenceAsyncHandler, this.collection, mongoId));
};

module.exports = MongoCollectionPersistence;
