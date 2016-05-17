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

var mongoose = require('mongoose');
var PrincipalSchema = require('./schema/PrincipalSchema');
var Principal = mongoose.model('principals', PrincipalSchema);
var PermissionsMerger = require('./PermissionsMerger');

var PermissionsUpdater = function(permissionsMerger) {
	this.permissionsMerger = permissionsMerger || new PermissionsMerger();
};

PermissionsUpdater.prototype.findAndUpdate = function (permissionsModifierBindedFunction, principalId, permissions, callback) {
    var query = {principalId : principalId};
    Principal.findOne(query, function(err, obj) {
        if (err) {
            throw err;
        }

        if (!obj) {
            throw new Error('Principal should exists before adding new permissions: ' +  principalId);
        }

        var newPermissions = permissionsModifierBindedFunction(obj.permissions, permissions);
        Principal.update(query, {permissions: newPermissions}, function(err, a){
            callback(err);
        });
    });
};

PermissionsUpdater.prototype.update = function(principalId, permissions, callback) {
	var permissionsMergeBindedFunction = this.permissionsMerger.merge.bind(this.permissionsMerger);
    this.findAndUpdate(permissionsMergeBindedFunction, principalId, permissions, callback);
};

PermissionsUpdater.prototype.remove = function(principalId, permissions, callback) {
    var permissionsSubtractBindedFunction = this.permissionsMerger.subtract.bind(this.permissionsMerger);
    this.findAndUpdate(permissionsSubtractBindedFunction, principalId, permissions, callback);
};

module.exports = PermissionsUpdater;