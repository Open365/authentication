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
var Hippie4eyeos = require('eyeos-hippie');
var uuid = require('node-uuid');

var hippie4Eyeos = new Hippie4eyeos();
var basePath = __dirname + '/har_files/';

function basicRequest(harPath) {
	var r = hippie4Eyeos.setRequestFromHar(harPath);
	r.timeout(20000);

	return r;
}

function authenticatedRequest(harPath) {
	var r = hippie4Eyeos.setRequestFromHar(harPath, true);
	r.timeout(20000);

	return r;
}

suite('component test with har files', function () {

	suite('captcha.GET', function () {
		function captchaGetRequest () {
			return basicRequest(basePath + 'captcha.GET.har')
				.parser(function(body, fn) {
					fn(null, body);
				});
		}

		test("should return a status 200", function (done) {
			captchaGetRequest()
				.expectStatus(200)
				.end(done);
		});

		test("should return a body with a data that contains a valid url and an id", function (done) {
			captchaGetRequest()
				.expectBody(/"url":/)
				.expectBody(/"(\/item\/\d+)/ig)
				.expectBody(/"id":/)
				.end(done);
		});
	});

	suite('login_success.POST', function () {
		function loginSuccessPostRequest () {
			return basicRequest(basePath + 'login_success.POST.har');
		}

		test("should return a status 200", function (done) {
			loginSuccessPostRequest()
				.parser(function(body, fn) {
					fn(null, body);
				})
				.expectStatus(200)
				.end(done);
		});
	});

	suite('checkCard.POST', function () {
		function checkCardPostRequest () {
			return authenticatedRequest(basePath + 'checkCard.POST.har')
				.parser(function(body, fn) {
					fn(null, body);
				});
		}

		setup(function (done) {
			hippie4Eyeos.login(done);
		});

		test('should return status 200', function (done) {
			checkCardPostRequest()
				.expectStatus(200)
				.end(done);
		});
	});

	suite('renewCard.POST', function () {
		function renewCardPostRequest () {
			return hippie4Eyeos.basicRequestWithCardAndSignature()
				.json()
				.post("/login/v1/methods/renewCard");
		}

		setup(function (done) {
			hippie4Eyeos.login(done);
		});

		test('should return status 200', function (done) {
			var oldCard = hippie4Eyeos.getCard();
			var oldSignature = hippie4Eyeos.getSignature();
			renewCardPostRequest()
				.send()
				.expectStatus(200)
				.expectValue("success", true)
				.expect(function(res, body, next) {
					assert.notEqual(oldSignature, body.signature);
					next();
				})
				.expect(function(res, body, next) {
					assert.notDeepEqual(oldCard, body.card);
					next();
				})
				.end(function(err, res, body) {
					console.log("body: ", body);
					done();
				});
		});
	});

	suite('login_fail.POST', function () {
		var username = uuid.v4();
		function loginFailPostRequest () {
			return basicRequest(basePath + 'login_fail.POST.har')
				.parser(function(body, fn) {
					fn(null, body);
				});
		}

		test("should return a status 403 if username is empty string", function(done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({type:'Basic', username:'', password: 'fhdghdf'})
				.end(done)
		});

		test("should return a status 403 if password is empty string", function(done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({type:'Basic', username: 'eyeos', password:''})
				.end(done)
		});

		test("should return a status 403 if username is not provided", function(done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({type:'Basic', password: 'sdfsdbfgb'})
				.end(done)
		});


		test("should return a status 403 if password is not provided", function(done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({type:'Basic', username: 'eyeos'})
				.end(done)
		});

		test("should return a status 400 if POSTed value is invalid", function(done) {
			loginFailPostRequest()
				.expectStatus(400)
				.send("Not a valid post value")
				.end(done)

		});

		test("should return a status 403 the first time", function (done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({"type":"Basic","username":username,"password":"kaka"})
				.end(done);
		});

		test("should return a status 403 the second time", function (done) {
			loginFailPostRequest()
				.expectStatus(403)
				.send({"type":"Basic","username":username,"password":"kaka"})
				.end(done);
		});

		test("should return a status 429 the third time", function (done) {
			loginFailPostRequest()
				.expectStatus(429)
				.send({"type":"Basic","username":username,"password":"kaka"})
				.end(done);
		});
	});

});

suite('component test without har files', function () {
	suiteSetup(function (done) {
		hippie4Eyeos.login(done, "eyeos", "eyeos");
	});

	suite("#Permissions", function () {
		suite("when adding a permission to a principal", function () {
			test("should return 200 with the new card", function (done) {
				hippie4Eyeos.basicRequestWithCardAndSignature()
					.put("/permissions/v1/principals/eyeos/permissions/")
					.send({"permissions":"testPermission"})
					.expectStatus(200)
					.expect(function (res, body, next){
						assert.equal(body.type, "newCardAvailable");
						next();
					})
					.end(done);
			});
		});
		suite("when removing a permission from a principal", function () {
			test("should return 200 with the new card", function (done) {
				hippie4Eyeos.basicRequestWithCardAndSignature()
					.del("/permissions/v1/principals/eyeos/permissions/")
					.send({"permissions":"testPermission"})
					.expectStatus(200)
					.expect(function (res, body, next){
						assert.equal(body.type, "newCardAvailable");
						next();
					})
					.end(done);
			});
		});
	});
});
