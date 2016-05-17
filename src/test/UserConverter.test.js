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

/**
 * Created by eyeos on 13/02/15.
 */
var sinon = require('sinon');
var chai = require('chai');
var UserConverter = require('../lib/login/providers/base/UserConverter');

suite('UserConverter', function() {

    var userConverter;
    var userBefore, userAfter;
    var attrMap;

    setup(function() {
        userBefore = {
            cn: "eyeos.username",
            sn: "User Surname",
            givenName: "User First Name",
            dn: "Unused Attribute"
        };

        userAfter = {
            userId: "eyeos.username",
            firstName: "User First Name",
            lastName: "User Surname",
            missingAttribute: "",
            domain: "open365.io"
        };

        attrMap = {
            "userId": "cn",
            "lastName": "sn",
            "firstName": "givenName",
            "missingAttribute": "notARealattribute"
        };
        userConverter = new UserConverter(attrMap);
    });

    test('UserConverter convert should convert attributes according to its attribute mapping', function() {
        var converted = userConverter.convert(userBefore);
        chai.assert.deepEqual(converted, userAfter);
    });

    test('UserConverter convert should not add attributes that aren\'t defined by the mapping', function() {
        var converted = userConverter.convert(userBefore);
        chai.assert.notProperty(converted, 'dn');
    });

    test('UserConverter convert attributes not defined by the mapping should be empty in the result', function() {
        var converted = userConverter.convert(userBefore);
        chai.assert.equal(converted.missingAttribute, '');
    });
});
