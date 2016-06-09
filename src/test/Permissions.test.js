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
var EyeosAuth = require('eyeos-auth');
var Permissions = require('../lib/permissions/Permissions');
var PermissionsUpdater = require('../lib/permissions/PermissionsUpdater');

suite('Permissions', function(){
	var sut;

	var eyeosAuth, eyeosAuthMock;
	var expSignCard;
	var callbackObj = {};

	var permissionsUpdater, permissionsUpdaterMock;
	var expAddPermissions;

	var principalId = 'foo.user';
	var domain = "domain";
	var card = {"domain":domain};
	var permissions = ["foo.bar", "some.stuff"];
	var restUtilsRequest = {
		parameters: {
			principals: principalId
		},
		document: {
			permissions: permissions
		},
		headers: {
			'Card': JSON.stringify(card),
		}
	};
	var permissionsUpdaterUpdateSpyCallback,
        permissionsUpdaterRemoveSpyCallback;

	setup(function(){
		eyeosAuth = new EyeosAuth();
		eyeosAuthMock = sinon.mock(eyeosAuth);
		expSignCard = eyeosAuthMock.expects('signCard').once().withExactArgs(principalId, domain, sinon.match.object);

		permissionsUpdater = new PermissionsUpdater();

		permissionsUpdaterUpdateSpyCallback = sinon.stub(permissionsUpdater, 'update', function(principalId, permissions, cb) {
			cb();
		});

        permissionsUpdaterRemoveSpyCallback  = sinon.stub(permissionsUpdater, 'remove', function(principalId, permissions, cb) {
            cb();
        });

		sut = new Permissions(permissionsUpdater, eyeosAuth, callbackObj);
	});

	suite('#addPermissions', function(){
		test('Should call permissionsUpdater.update with userId and permissions from request', function(){
			sut.addPermissions(restUtilsRequest);
			sinon.assert.calledWith(permissionsUpdaterUpdateSpyCallback, principalId, permissions, sinon.match.func);
		});
		test('When permissions are merged, we should call this.cardRenewer.renew', function () {
			sut.addPermissions(restUtilsRequest);
			expSignCard.verify();
		});
	});

    suite('#removePermissions', function(){
        test('Should call permissionsUpdater.remove with userId and permissions from request', function(){
            sut.removePermissions(restUtilsRequest);
            sinon.assert.calledWith(permissionsUpdaterRemoveSpyCallback, principalId, permissions, sinon.match.func);
        });
        test('When permissions are subtracted, we should call this.cardRenewer.renew', function () {
            sut.removePermissions(restUtilsRequest);
            expSignCard.verify();
        });
    });


});