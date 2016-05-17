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

var pngStash = require('png-stash');
var logo = __dirname + '/../../resources/eyeos_logo.png';
var messageLenght = 470;
var message = null;

// IMPORTANT: Extra is the codename for License, this class provides the public key
// it extracts the eyeos public key hidden inside the eyeos_logo.png

var ExtraKProvider = {

	// Extract the eyeos public key from the eyeos_logo.png
	// this is called when starting the authentication to have the key in memory
	initializeExtraK: function(callback) {
		var self = this;
		pngStash(logo, function (err, stash) {
			if (err) {
				callback(err);
			}

			var messageBuffer = stash.read(0, messageLenght);
			var message = messageBuffer.toString('utf-8');

			self.message = message;
			callback(null);
		});
		return this.extra;
	},

	// Get the eyeos public key
	getExtraK: function() {
		return this.message;
	}


};


module.exports = ExtraKProvider;
