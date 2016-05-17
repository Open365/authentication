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
var settings = require('../settings');
var PrincipalProviderV2 = require('eyeos-principal').PrincipalProvider;
var mongoose = require('mongoose');

//TechDebt: VDI-3183 This principalProvider should be the one in eyeos-principal (PrincipalProviderV2 in this file)
var PrincipalProvider = function(PrincipalSingleton, systemGroupsProviderInstance, SystemGroupsSingleton, principalProviderV2) {
	this.PrincipalSingleton = PrincipalSingleton || require('./PrincipalSingleton');
	this.SystemGroupsSingleton = SystemGroupsSingleton || require('./SystemGroupsSingleton');
	var SystemGroupsProvider = require('./SystemGroupsProvider');
	this.systemGroupsProvider = systemGroupsProviderInstance || new SystemGroupsProvider(settings.mongoInfo, settings.stompServer);
	this.logger = log2out.getLogger('PrincipalProvider');
};

PrincipalProvider.prototype.createPrincipal = function(user, cb, principalProviderV2) {
	var principalProviderV2 = principalProviderV2 ||
		new PrincipalProviderV2(this.PrincipalSingleton.getInstance(), this.SystemGroupsSingleton.getInstance(), null, mongoose);
	principalProviderV2.createPrincipal(user, cb, settings.administratorUsername, settings.mustChangePassword);
};

PrincipalProvider.prototype.updatePrincipal = function (principal, cb) {
	var self = this;
	self.logger.debug("Updating principal ", principal);
	var Principal = this.PrincipalSingleton.getInstance();

    Principal.findOneAndUpdate({ principalId: principal.principalId, domain: principal.domain }, { $set: principal }, { new: true }, function (err, updatedPrincipal) {
		if (err) {
			this.logger.error('Error updating principal: ', err);
			cb(err);
			return;
		}

		var realCb = function (err, object) {
			if (object) {
				object.populate('systemGroups', cb);
			} else {
				cb(err, object);
			}
		};

		// principal does not exist
		if (!updatedPrincipal) {
			self.logger.debug("Creating principal");
			self.createPrincipal(principal, realCb);
			return;
		}
		realCb(null, updatedPrincipal);
	});
};

PrincipalProvider.prototype.setAndUpdateSystemGroupsFromDb = function(principalFromDb, cb, err, systemGroupsFromDb) {
	//convert principal to Object before setting its systemGroups to the systemGroupsFromDb
	//if it is not done so, Mongoose automatically converts the systemGroups to the format in PrincipalSchema
	var principalObject = principalFromDb.toObject();
	principalObject.systemGroups = systemGroupsFromDb;

	var self = this;
	if (systemGroupsFromDb && principalFromDb.systemGroups && systemGroupsFromDb.length < principalFromDb.systemGroups.length) {
		this.logger.debug(
			'Principal has (', principalFromDb.systemGroups.length, ') references to systemGroups (found ',
			systemGroupsFromDb.length, ' in MongoDB) Some references are broken, this is expected. Fixing it.');
		principalFromDb.systemGroups = systemGroupsFromDb;
		principalFromDb.save(function (err) {
			if (err) {
				self.logger.error('Error while saving back principal:', principalFromDb, err);
			} else {
				self.logger.debug('Successfully updated principal with principalId:', principalFromDb.principalId);
			}
		});
	}
	cb(principalObject);
	return;
};

PrincipalProvider.prototype.getPrincipal = function(userId, cb) {
	var Principal = this.PrincipalSingleton.getInstance();
	var self = this;
	Principal.findOne({principalId: userId}, function(err, principalFromDb) {
		if (err) {
			self.logger.error("Error getting principal: ", err);
            cb(err);
        }
		self.logger.debug('This is a known user. Recovered info from mongodb:', principalFromDb);
		self.systemGroupsProvider.getAllIn(principalFromDb.systemGroups, self.setAndUpdateSystemGroupsFromDb.bind(self, principalFromDb, cb));

	});
};

PrincipalProvider.prototype.getPrincipalStandardNodeCallback = function(userId, cb){
	function transformNonStandardNodeCallbackToStandard(principal){
		cb(null, principal);
	}
	this.getPrincipal(userId, transformNonStandardNodeCallbackToStandard);

};

PrincipalProvider.prototype.addSystemGroups = function(principalId, systemGroups, callback) {
	var principal = this.PrincipalSingleton.getInstance();
	var self = this;
	principal.update({principalId: principalId},
		{$addToSet: {systemGroups: {$each: systemGroups}}},
		function (err) {
			self.systemGroupsProvider.notify(systemGroups);
			if (callback) {
				callback(err);
			}
		});
};

PrincipalProvider.prototype.removeSystemGroups = function(principalId, systemGroups, callback) {
	var principal = this.PrincipalSingleton.getInstance();
	var self = this;
	principal.update({principalId: principalId},
		{$pullAll: {systemGroups: systemGroups}},
		function (err) {
			self.systemGroupsProvider.notify(systemGroups);
			if (callback) {
				callback(err);
			}
		});
};



module.exports = PrincipalProvider;

