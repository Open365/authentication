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
var assert = require('chai').assert;

var LDAPProvider = require('../lib/login/providers/ldap/LDAPProvider');

var LDAPStringBuilder = require('../lib/login/providers/ldap/LDAPStringBuilder');
var LDAPConnection = require('../lib/login/providers/ldap/LDAPConnection');
var Credentials = require('../lib/login/Credentials');
var BasicAuth = require('../lib/login/authinfo/BasicAuth');


suite('LDAPProvider', function(){
    var sut, ldapStringBuilder, ldapStringBuilderMock, ldapConnection, ldapConnectionMock, callback;
	var dn = 'testdn@myDomain.com';
	var authInfo = {
		username: 'testuser',
		password: 'testpassword',
		domain: 'myDomain.com'
	};

    setup(function() {
		callback = function () {};
		ldapStringBuilder = new LDAPStringBuilder();
		ldapStringBuilderMock = sinon.mock(ldapStringBuilder);

		ldapConnection = new LDAPConnection();
		ldapConnectionMock = sinon.mock(ldapConnection);

        sut = new LDAPProvider(ldapStringBuilder, ldapConnection);
    });

    suite('#login', function(){
		var expLoginCreateDN, expLoginLDAPLogin;
		var credentials, auth;

		setup(function() {
			auth = new BasicAuth(authInfo);
			credentials = new Credentials(auth);
			expLoginCreateDN = ldapStringBuilderMock.expects('createDN').withExactArgs(authInfo.username+'@'+authInfo.domain).returns(dn);
			expLoginLDAPLogin = ldapConnectionMock.expects('login').withExactArgs(dn, authInfo.password, callback);
		});

        test('should call LDAPStringBuilder createDN with the username', function(){
			sut.login(credentials, callback);
			expLoginCreateDN.verify();
        });

		test('should call LDAPConnection login with DN from LDAPStringBuilder', function() {
			sut.login(credentials, callback);
			expLoginLDAPLogin.verify();
		});
    });

	suite('#getType', function(){
		test('It should return "ldap" which is the Provider types', function(){
			assert.equal(sut.getType(), "ldap");
		});
	});
});
