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
var LDAPStringBuilder = require('../lib/login/providers/ldap/LDAPStringBuilder');
var ldapSanitizer = require('../lib/login/providers/base/LDAPSanitizer');
var settings = require('../lib/settings-test');

suite('LDAPStringBuilder', function () {
	var sut, ldapSanitizerMock;

	setup(function () {
        ldapSanitizerMock = sinon.mock(ldapSanitizer);
		sut = new LDAPStringBuilder(settings, ldapSanitizer);
	});

    teardown(function(){
        ldapSanitizerMock.restore();
        settings.ldap.DN = 'ou=People,dc=eyeos,dc=org';
    });

	suite('#createDN', function () {
		test('should create a DN string upon the username testuser', function () {
			var createdDN = sut.createDN('testuser');
			assert.equal(createdDN, 'cn=testuser,ou=People,dc=eyeos,dc=org');
		});

		test('should create valid DN strings for any possible user', function () {
			var createdDN = sut.createDN('anotheruser');
			assert.equal(createdDN, 'cn=anotheruser,ou=People,dc=eyeos,dc=org');
		});

		test('should create DN Strings using the given settings', function(){
		    //its enough to modify just this property here, because in javascript
			//objects are passed by reference.
			settings.ldap.DN = 'ou=People,dc=eyeos,dc=com';

			var createdDN = sut.createDN('anotheruser');
			assert.equal(createdDN, 'cn=anotheruser,ou=People,dc=eyeos,dc=com');
		});

        test('should call LDAPSanitizer sanitize with the username', function () {
            var username = 'testuser';
            var sanitizedName = 'testuser';
            var expSanitize = ldapSanitizerMock.expects('sanitize').withExactArgs(username).returns(sanitizedName);
            var createdDN = sut.createDN(username);
            expSanitize.verify();
        });

        test('when called with a username containing invalid chars should create valid DN strings with escaped chars', function () {
            var username = 'test+user';
            var sanitizedName = 'test\\+user';
            var expSanitize = ldapSanitizerMock.expects('sanitize').returns(sanitizedName);
            var createdDN = sut.createDN(username);
            assert.equal(createdDN, 'cn=' + sanitizedName + ',ou=People,dc=eyeos,dc=org');
        });
	});
});
