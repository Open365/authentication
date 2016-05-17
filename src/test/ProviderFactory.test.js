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
var ProviderFactory = require('../lib/login/providers/ProviderFactory');
var settings = require('../lib/settings-test');

suite('ProviderFactory', function(){
	var sut;

	setup(function(){
		sut = new ProviderFactory(settings);
	});

	suite('#getProvider', function(){
		test('should return a ldap provider', function(){
			var provider = sut.getProvider();
			assert.equal(provider.getType(), "ldap");
		});
		test('should be able to load any provider specified in settings', function () {
			settings.loginProvider = "dummy";
			var provider = sut.getProvider();
			assert.equal(provider.getType(), "dummy");
		});
		test('should throw an exception if provider can not be loaded', function () {
			settings.loginProvider = "not existing provider";
			assert.throws(sut.getProvider, Error);
		});
	});
});