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

var MongoPersistenceCallback = function(objectCallback) {
	this.objectCallback = objectCallback;
	this.logger = log2out.getLogger('MongoPersistenceCallback');
};

MongoPersistenceCallback.prototype.requestFetched = function(err, result) {
	if (err) {
		this.logger.debug('.requestFetched: error happened, returning 0');
		this.objectCallback.gotRequest(0);
		return;
	}

	var numOfRequest = 0;
	if (result && result.request) {
		numOfRequest = result.request;
	}

	this.logger.debug('.requestFetched: calling gotRequest with: ' + numOfRequest);
	this.objectCallback.gotRequest(numOfRequest);
};

MongoPersistenceCallback.requestFetchedCallback = function(self) {
	self.logger.debug('.requestFetchedCallback');
	return function(err, result) {
		self.logger.debug('.requestFetchedCallback callback');
		self.requestFetched(err, result);
	};
};

MongoPersistenceCallback.prototype.requestIncremented = function(err, result) {
	if (err) {
		this.logger.error(err);
	}
	this.logger.debug('.requestIncremented');
	this.objectCallback.requestIncremented(result);
};

MongoPersistenceCallback.requestIncrementedCallback = function(self) {
	self.logger.debug('.requestIncrementedCallback');
	return function(err, result) {
		self.logger.debug('..requestIncrementedCallback callback');
		self.requestIncremented(err, result);
	};
};

MongoPersistenceCallback.prototype.requestCleared = function(err, result) {
	if (err) {
		this.logger.error(err);
	}
	this.logger.debug('.requestCleared');
};

MongoPersistenceCallback.requestClearedCallback = function(self) {
	self.logger.debug('.requestClearedCallback');
	return function(err, result) {
		self.logger.debug('.requestClearedCallback callback');
		self.requestCleared(err, result);
	};
};

module.exports = MongoPersistenceCallback;
