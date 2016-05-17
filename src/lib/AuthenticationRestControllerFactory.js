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

var RestController = require('eyeos-restutils').RestController;
var RequestParser = require('eyeos-restutils').RequestParser;
var AuthenticationRestRouter = require('./AuthenticationRestRouter.js');

var authenticationRestControllerFactory = {
	getRestController: function() {
		var router = new AuthenticationRestRouter();
		var restController = new RestController(function(analyzedRequest, httpResponse){
			router.dispatch(analyzedRequest, httpResponse);
		}, this, new RequestParser(this.bodyParser));
		return restController;
	},
	bodyParser: function(body) {
		var data;
		try {
				data = JSON.parse(body);
		} catch (e) {
				data = body;
		}

		return data;
	}
};

module.exports = authenticationRestControllerFactory;
