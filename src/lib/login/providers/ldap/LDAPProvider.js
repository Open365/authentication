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

var LDAPStringBuilder = require('./LDAPStringBuilder');
var LDAPConnection = require('./LDAPConnection');
var settings = require('../../../settings');

var LDAPProvider = function(ldapStringBuilder, ldapConnection) {
	this.ldapStringBuilder = ldapStringBuilder || new LDAPStringBuilder();
	this.ldapConnection = ldapConnection || new LDAPConnection();
};

LDAPProvider.prototype.login = function(credentials, requestFinisher) {
	var dn = this.ldapStringBuilder.createDN(credentials.getAuthInfo().getFullUsername());
	this.ldapConnection.login(dn, credentials.getAuthInfo().getPassword(), requestFinisher);
};

LDAPProvider.prototype.getType = function() {
	return "ldap";
};

module.exports = LDAPProvider;
