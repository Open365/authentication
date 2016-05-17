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

var sinon = require('sinon');
var chai = require('chai');

var LDAPConnection = require('../lib/login/providers/ldap/LDAPConnection');

var ldap = require('ldapjs');
var settings = require('../lib/settings-test');

suite('LDAPConnection', function () {
	var sut, ldapMock, ldapClientMock, callback;
	var expLoginCreateClient, expLoginBind;
	var dn = 'testdn', password = 'testpassword';

	setup(function () {
		callback = function () {};
		var fakeLdapClient = {
			bind: function(){},
		};
		ldapClientMock = sinon.mock(fakeLdapClient);
		ldapMock = sinon.mock(ldap);

		expLoginCreateClient = ldapMock.expects('createClient').withExactArgs(sinon.match({url: settings.ldap.URL})).returns(fakeLdapClient);
		expLoginBind = ldapClientMock.expects('bind').withExactArgs(dn, password, sinon.match.func);

		sut = new LDAPConnection(settings, ldap);
	});

	teardown(function () {
		ldapMock.restore();
	});

	suite('#login', function () {
		test('should call ldap createClient with URL from settings', function () {
			sut.login(dn, password, callback);
			expLoginCreateClient.verify();
		});
		test('should call ldap bind with given dn and password as arguments', function () {
			sut.login(dn, password, callback);
			expLoginBind.verify();
		});
	});
});
