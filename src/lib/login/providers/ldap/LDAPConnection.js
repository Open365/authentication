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

var LoginResult = require('../../LoginResult');
var UserConverter = require('./../base/UserConverter');
var log2out = require('log2out');

var LDAPConnection = function (settings, ldap, userConverter) {
	this.settings = settings || require('../../../settings');
	this.ldap = ldap || require('ldapjs');
	this.logger = log2out.getLogger("LDAPConnection");
    this.userConverter = userConverter || new UserConverter(this.settings.ldap.LDAPAttrMap);
};

LDAPConnection.prototype.login = function (dn, password, requestFinisher) {
    var self = this;

    self.logger.debug(".login", dn);
	var options = {
		url: this.settings.ldap.URL,
		timeout: this.settings.ldap.timeout,
		connectTimeout: this.settings.ldap.connectTimeout
	};
	var ldapClient = this.ldap.createClient(options);
    try {
        ldapClient.bind(dn, password, function (err) {
            if (err) {
                ldapClient.unbind();
                // LDAP Error codes for invalid credentials, invalid DN, unauthenticated bind disallowed
                if (err.code === 49 || err.code === 34 || err.code === 53) {
                    requestFinisher.loginFinished(LoginResult.INVALID_CREDENTIALS);
                } else {
                    requestFinisher.loginFinished(LoginResult.CONNECTION_ERROR);
                }
                return;
            }
            ldapClient.search(dn, function onSearch(err, res) {
                if (err) {
                    self.logger.error(".ldapClient.search", err);
                    ldapClient.unbind();
                    requestFinisher.loginFinished(LoginResult.CONNECTION_ERROR);
                    return;
                }

                res.on('searchEntry', function (entry) {
                    self.logger.debug("Before conversion: ", entry.object);
                    var user = self.userConverter.convert(entry.object);
                    self.logger.debug("After conversion: ", user);
                    requestFinisher.loginFinished(null, user);
                });
                res.on('end', function (result) {
                    ldapClient.unbind();
                    self.logger.debug('onSearchEnd', result.status);
                });
                res.on('error', function (err) {
                    ldapClient.unbind();
                    self.logger.error(".ldapClient.search.response", err);
                    requestFinisher.loginFinished(LoginResult.CONNECTION_ERROR);
                });
            });
        });
    } catch (e) {
        self.logger.error("Bad message sent by user", dn, "error was", e);
        requestFinisher.loginFinished(LoginResult.INVALID_CREDENTIALS);
    }
};

module.exports = LDAPConnection;
