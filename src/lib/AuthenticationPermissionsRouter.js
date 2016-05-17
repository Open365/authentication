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

var Permissions = require('./permissions/Permissions');
var EyeosAuth = require('eyeos-auth');

var AuthenticationPermissionsRouter = function(permissions, eyeosAuth) {
	this.permissions = permissions || new Permissions();
	this.eyeosAuth = eyeosAuth || new EyeosAuth();
};


AuthenticationPermissionsRouter.prototype._checkPermissions = function(restUtilsRequest) {
	var permission;
	if (restUtilsRequest.document && restUtilsRequest.document.permissions) {
		permission = restUtilsRequest.document.permissions.split('.');
		if (permission[1] === 'subject') {
			if (!this.eyeosAuth.hasPermission(restUtilsRequest, "eyeos.admin.subjects.edit")) {
				return false;
			}
		}
	} else {
		if (restUtilsRequest.headers.Host) {
			// This request comes from the REST API, so we need to verify it has permission
			if (!this.eyeosAuth.hasPermission(restUtilsRequest, "eyeos.admin.profiles.edit")) {
				return false;
			}
		}
	}

	return true;
};


AuthenticationPermissionsRouter.prototype.dispatch = function(restUtilsRequest, restUtilsReply) {

	if (!this._checkPermissions(restUtilsRequest)) {
		restUtilsReply.invalidRequest();
	}
	
    var userPathIsPrincipals = /principals\/\S+\/permissions/.test(restUtilsRequest.userPath);

	if (restUtilsRequest.method === 'PUT' && userPathIsPrincipals) {
		this.permissions.addPermissions(restUtilsRequest, restUtilsReply);
		return;
	} else if (restUtilsRequest.method === 'DELETE' && userPathIsPrincipals) {
        this.permissions.removePermissions(restUtilsRequest, restUtilsReply);
        return;
    }
	restUtilsReply.invalidRequest();
};

module.exports = AuthenticationPermissionsRouter;
