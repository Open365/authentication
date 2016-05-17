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
var settings = require('../../../settings');

var UserConverter = function (attrMap) {
    this.attrMap = attrMap || settings.ldap.attrMapping;
    this.logger = log2out.getLogger('UserConverter');
};

// Right now it can't handle transformations that aren't assignments, like splitting full name in first + last.
UserConverter.prototype.convert = function (ldapuser) {
    var self = this;
    this.logger.debug('Using attribute mapping:', this.attrMap);
    var user = {};
    Object.keys(self.attrMap).forEach(function(attr) {
        user[attr] = ldapuser[self.attrMap[attr]] || "";
    });

    if ( user.principalId && user.principalId.indexOf('@') !== -1) {
        var principalId = user.principalId.split('@');
        user.principalId = principalId[0];
        user.domain = principalId[1];
    } else {
        user.domain = settings.defaultDomain;
    }

    return user;
};

module.exports = UserConverter;
