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
var Permissions = require('../lib/permissions/Permissions');
var EyeosAuth = require('eyeos-auth');
var AuthenticationPermissionsRouter = require('../lib/AuthenticationPermissionsRouter');

suite('AuthenticationPermissionsRouter', function(){
	var sut;

	var permissions, permissionsMock;
	var expPermissionsAdd, expPermissionsRemove;

	var restUtilsModifyPermissionsRequest, restUtilsRemovePermissionsRequest;

	var restUtilsReply = {
		invalidRequest: function(){}
	}, restUtilsReplyMock;

	var expInvalidRequest;

	var eyeosAuth, hasPermnissionStub;

	setup(function(){
		restUtilsModifyPermissionsRequest = {
			headers: {},
			method: 'PUT',
			userPath: '/principals/foo.bar/permissions/'
		};
		restUtilsRemovePermissionsRequest = {
			headers: {},
			method: 'DELETE',
			userPath: '/principals/foo.bar/permissions/'
		};


		restUtilsReplyMock = sinon.mock(restUtilsReply);
		expInvalidRequest = restUtilsReplyMock.expects('invalidRequest').once().withExactArgs();

		permissions = new Permissions();
		permissionsMock = sinon.mock(permissions);
		expPermissionsAdd = permissionsMock.expects('addPermissions')
											.once()
											.withExactArgs(restUtilsModifyPermissionsRequest, restUtilsReply);
        expPermissionsRemove = permissionsMock.expects('removePermissions')
                                            .once()
                                            .withExactArgs(restUtilsRemovePermissionsRequest, restUtilsReply);

		eyeosAuth = new EyeosAuth();
		hasPermnissionStub = sinon.stub(eyeosAuth, 'hasPermission');

		sut = new AuthenticationPermissionsRouter(permissions, eyeosAuth);
	});

	teardown(function() {
		restUtilsReplyMock.restore();
	});

	suite('#dispatch', function(){
		test('a petition for addPermissions (PUT on /principals/foo.bar/permissions/), should be dispatched to Permissions.addPermissions', function(){
			sut.dispatch(restUtilsModifyPermissionsRequest, restUtilsReply);
			expPermissionsAdd.verify();
		});

        test('a petition for removePermissions (DELETE on /principals/foo.bar/permissions/), should be dispatched to Permissions.removePermissions', function(){
            sut.dispatch(restUtilsRemovePermissionsRequest, restUtilsReply);
            expPermissionsRemove.verify();
        });

		test('When no routing is found for a request, call invalidRequest', function () {
			restUtilsModifyPermissionsRequest.method = 'foo';
			sut.dispatch(restUtilsModifyPermissionsRequest, restUtilsReply);
			expInvalidRequest.verify();
		});

		test('calls restUtilsReply.invalidRequest when REST request and doesn\'t have permission', function () {
			restUtilsModifyPermissionsRequest.headers.Host = 'fakeHost';

			hasPermnissionStub.returns(false);

			sut.dispatch(restUtilsModifyPermissionsRequest, restUtilsReply);

			expInvalidRequest.verify();

		});

		test('calls Permissions.addPermissions when REST PUT request and does have permissions', function () {
			restUtilsModifyPermissionsRequest.headers.Host = 'fakeHost';

			hasPermnissionStub.returns(true);

			sut.dispatch(restUtilsModifyPermissionsRequest, restUtilsReply);

			expPermissionsAdd.verify();
		});
	});
});
