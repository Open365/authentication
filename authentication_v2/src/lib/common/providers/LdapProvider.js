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

var settings = require('../../settings');
var ldap = require('ldapjs');
var ErrorHandler = require('../../common/providers/ErrorHandler');

var LdapProvider = function (customSettings, ldapClient, errorHandler) {
    this.settings = customSettings || settings;
    this.ldapClient = ldapClient || ldap.createClient({url: this.settings.ldap.url});
    this.errorHandler = errorHandler || new ErrorHandler(this.settings);
};

LdapProvider.prototype.setPassword = function(data, cb) {
    var self = this;

    try {
        this.ldapClient.bind(self.settings.ldap.admin.user, self.settings.ldap.admin.password, function(err) {
            if (err) {
                cb(self.errorHandler.createErrorObject(503, 4, e.message));
                return;
            }

            var changeData = new ldap.Change({
                operation: 'replace',
                modification: { userPassword: data.password }
            });
            try {
                self.ldapClient.modify('cn='+ data.username +',' +  self.settings.ldap.base, changeData, function(err) {
                    if(err){
                        cb(self.errorHandler.createErrorObject(503, 4, e.message));
                        return;
                    }
                    cb(null);
                });
            } catch(e) {
                cb(self.errorHandler.createErrorObject(503, 4, e.message));
            }
        });
    } catch(e) {
        cb(self.errorHandler.createErrorObject(503, 4, e.message));
    }
};

module.exports = LdapProvider;