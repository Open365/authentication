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

var mongoDriverSingleton = require('eyeos-mongo').mongoDriverSingleton;

var Persistence = function(settings) {
	this.collection_name = "forgotpassword";
	this.settings = settings;
};

Persistence.prototype.getUserInfo = function(username, callback) {
	var self = this;
	if(this.driver) {
		var collection = this.driver.getCollection(this.collection_name);
		var query = {principalId: username};
		collection.findOne(query, callback);
		return;
	}
	console.log("MongoDriver not connected yet, connecting...");
	mongoDriverSingleton.connect({
		setMongoStarted: function(started) {
			self.driver = mongoDriverSingleton.getMongoDriver();
			self.getUserInfo(username, callback);
		}
	}, this.settings);
};

module.exports = Persistence;