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

var EyeosAuth = require('eyeos-auth');
var SendCardToUser = require('./SendCardToUser');
var PermissionsUpdater = require('./PermissionsUpdater');
var mongoose = require('mongoose');
var PrincipalProvider = require('eyeos-principal').PrincipalProvider;

var Permissions = function(permissionsUpdater, eyeosAuth, sendCardToUser, rsaSigner) {
    if (!rsaSigner) {
        var Principal = require('eyeos-principal').PrincipalSchema(mongoose).getModel();
        var SystemGroup = require('eyeos-principal').SystemGroupSchema(mongoose).getModel();

        this.rsaSigner = EyeosAuth.createRsaSigner(new PrincipalProvider(Principal, SystemGroup));
    } else {
        this.rsaSigner = rsaSigner;
    }

	this.permissionsUpdater = permissionsUpdater || new PermissionsUpdater();
	this.eyeosAuth = eyeosAuth || new EyeosAuth(null, null, this.rsaSigner);
};

Permissions.prototype.changePermissions = function(restUtilsRequest, restUtilsReply, changeBindedMethod) {
    var principalId = restUtilsRequest.parameters.principals;
    var domain = this.eyeosAuth.requestParser.getCard(restUtilsRequest).domain;
    var permissions = restUtilsRequest.document.permissions;

    var self = this;
    changeBindedMethod(principalId, permissions, function() {
        self.eyeosAuth.signCard(principalId, domain, new SendCardToUser(restUtilsReply));
    });
};

Permissions.prototype.addPermissions = function(restUtilsRequest, restUtilsReply) {
	var updateBindedMethod = this.permissionsUpdater.update.bind(this.permissionsUpdater);
	this.changePermissions(restUtilsRequest, restUtilsReply, updateBindedMethod);
};

Permissions.prototype.removePermissions = function(restUtilsRequest, restUtilsReply) {
    var removeBindedMethod = this.permissionsUpdater.remove.bind(this.permissionsUpdater);
    this.changePermissions(restUtilsRequest, restUtilsReply, removeBindedMethod);
};

module.exports = Permissions;