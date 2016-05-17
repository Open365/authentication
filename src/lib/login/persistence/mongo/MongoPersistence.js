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
var mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;
var MongoPersistenceCallback = require('./MongoPersistenceCallback');
var settings = require('../../../settings.js');

var COLLECTION_NAME = 'requestMeter';

/**
 * @note that argument is the Driver while default is a Factory (for easier mocking)
 */
var MongoPersistence = function(mongoDriver, MongoPersistenceCallback) {
	this.logger = log2out.getLogger('MongoPersistence');
	this.mongoDriver = mongoDriver || mongoDriverSingleton.getMongoDriver(settings);
	this.MongoPersistenceCallback = MongoPersistenceCallback || MongoPersistenceCallback;
	this.collection = null;
};

MongoPersistence.prototype.getType = function() {
    return "mongo";
};

/**
 * Lazily gets MongoDB collection and ensures its index.
 * @return MongoDB collection for COLLECTION_NAME
 */
MongoPersistence.prototype.getCollection = function () {
	if (this.collection) {
		return this.collection;
	} else {
		var collection = this.mongoDriver.getCollection(COLLECTION_NAME);
		this.collection = collection;
		var self = this;
		this.collection.ensureIndex('userId', function(err, indexName) {
			if (err) {
				self.collection = null;
				self.logger.error('Error trying to ensure index on userId for collection ', COLLECTION_NAME);
				return;
			} else {
				self.collectionIndexName = indexName;
			}
		});
		return collection;
	}
};

MongoPersistence.prototype.getRequest = function(id, service, callback) {
	this.logger.debug('.getRequest: id: ' + id + ' service: ' + service);
	var collection = this.getCollection();
	var persistenceCallback = new MongoPersistenceCallback(callback);

	var query = {userId: id, serviceId: service};
	collection.findOne(query, MongoPersistenceCallback.requestFetchedCallback(persistenceCallback));
};

MongoPersistence.prototype.incrementRequest = function(id, service, callback) {
	this.logger.debug('.incrementRequest: id: ' + id + ' service: ' + service);
	var collection = this.getCollection();
	var persistenceCallback = new MongoPersistenceCallback(callback);

	var query = {userId: id, serviceId: service};
	var document = {$inc: {request: 1}};//Increase request by 1
	var opts = {upsert: true}; //Create document if it does not exists
	collection.update(query, document, opts, MongoPersistenceCallback.requestIncrementedCallback(persistenceCallback));
};

MongoPersistence.prototype.clearRequest = function(id, service) {
	this.logger.debug('.clearRequest: id: ' + id + ' service: ' + service);
	var collection = this.getCollection();
	var persistenceCallback = new MongoPersistenceCallback();

	var query = {userId: id, serviceId: service};
	collection.remove(query, MongoPersistenceCallback.requestClearedCallback(persistenceCallback));
};

module.exports = MongoPersistence;
