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
var PrincipalProvider = require('eyeos-principal').PrincipalProvider;
var ExtraFilter = require('../lib/login/ExtraFilter');
var ExtraController = require('eyeos-extra').Controller;


suite('ExtraFilter', function(){
    var sut;
    var principalProvider;
    var extra;
    var principalProviderGetPrincipalByIdStub, principalProviderGetNumPrincipalsStub, extraControllerGetExtraStub;

    function buildSut(numLicences, validateLicense) {
        extra = {
            getLimit: function() {
                return numLicences;
            },
            getUrl: function() {
                return 'eyeos.com';
            }
        };

        if (validateLicense === undefined) {
            validateLicense = true;
        }
        var settings = {
            validateLicense: validateLicense
        };
        var extraController = new ExtraController();
        extraControllerGetExtraStub = sinon.stub(extraController, "getExtra").returns(extra);
        principalProvider = new PrincipalProvider();
        principalProviderGetPrincipalByIdStub = sinon.stub(principalProvider, 'getPrincipalById');
        principalProviderGetNumPrincipalsStub = sinon.stub(principalProvider, 'getNumPrincipals');
        sut = new ExtraFilter(null, null, extraController, principalProvider, settings);
    }

    suite('#check', function() {
        suite('when validateLicense => true', function () {
            setup(function () {
                buildSut(10, true);
            });

            test('when principal is already in eyeos should call provided callback with true', function () {
                principalProviderGetPrincipalByIdStub.callsArgWith(1, null, 'a user');
                var expectedCallback = sinon.spy();
                var host = 'eyeos.com';
                sut.check('marc.monge', host, expectedCallback);
                sinon.assert.calledWithExactly(expectedCallback, true);
            });

            test('when principal is not already in eyeos but the licences number is not exeded should call provided callback with true', function () {
                principalProviderGetPrincipalByIdStub.callsArgWith(1, null, null);
                principalProviderGetNumPrincipalsStub.callsArgWith(0, 5);
                var expectedCallback = sinon.spy();
                var host = 'eyeos.com';
                sut.check('marc.monge', host, expectedCallback);
                sinon.assert.calledWithExactly(expectedCallback, true);
            });

            test('when principal is not already in eyeos and the licences number is exeded should call provided callback with false', function () {
                principalProviderGetPrincipalByIdStub.callsArgWith(1, null, null);
                principalProviderGetNumPrincipalsStub.callsArgWith(0, 10);
                var expectedCallback = sinon.spy();
                var host = 'eyeos.com';
                sut.check('marc.monge', host, expectedCallback);
                sinon.assert.calledWithExactly(expectedCallback, false);
            });

            test('when host domain is different to license domain should call provided callback with false', function () {
                var expectedCallback = sinon.spy();
                var host = 'citrix.com';
                sut.check('marc.monge', host, expectedCallback);
                sinon.assert.calledWithExactly(expectedCallback, false);
            });
        });

        suite('when validateLicense => false', function () {
            setup(function () {
                buildSut(10, false);
            });

            test('should call provided callback with true', function () {
                var expectedCallback = sinon.spy();
                sut.check('someuser', 'somehost', expectedCallback);
                sinon.assert.calledWithExactly(expectedCallback, true);
            });
        });
    });
});
