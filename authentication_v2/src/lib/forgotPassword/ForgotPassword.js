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

var logger = require('log2out').getLogger('ForgotPassword');
var ForgotPasswordProvider = require('./provider/ForgotPasswordProvider');
var settings = require('../settings');

var ForgotPassword = function (customSettings) {
    this.logger = logger;
    this.settings = customSettings || setings;
};

ForgotPassword.prototype.postForgot = function(req, res) {
    var userData = {};
    var responseOkMessage = "We've sent an email with the instructions for recover your password";

    userData.username = req.body.username;
    userData.lang = req.body.lang;
    userData.domain = req.body.domain;

    if (typeof userData.username === 'undefined' || !checkUsername(userData.username)) {
        res.status(403).json({error: 1, msg: "Invalid or missing username"}).end();
        return;
    }

    if (typeof userData.lang === 'undefined' || this.settings.supportedLanguages.indexOf(userData.lang) === -1) {
        res.status(403).json({error: 5, msg: "Invalid or missing language"}).end();
        return;
    }

    if (typeof userData.domain === 'undefined' || !checkDomain(userData.domain)) {
        res.status(403).json({error: 6, msg: "Invalid or missing url domain name"}).end();
        return;
    }

    var forgotPasswordProvider = new ForgotPasswordProvider(this.settings);
    forgotPasswordProvider.doForgotActions(userData, function(err) {
        if(err) {
            return res.status(err.httpCode).json({error: err.errorCode, msg: err.message }).end();
        }
        res.status(200).json({ msg: responseOkMessage }).end();
    });
};

ForgotPassword.prototype.postRecover = function(req, res) {
    var userData = {};
    var responseOkMessage = "Password changed correctly";

    userData.username = req.body.username;
    userData.password = req.body.password;
    userData.token = req.body.token;

    if (typeof userData.username === 'undefined' || !checkUsername(userData.username)) {
        res.status(403).json({error: 1, msg: "Invalid or missing username"}).end();
        return;
    }
    if (typeof userData.password === 'undefined' && password.length < this.settings.password.minLength) {
        res.status(403).json({error: 2, msg: "Invalid or missing password"}).end();
        return;
    }
    if (typeof userData.token === 'undefined') {
        res.status(403).json({error: 3, msg: "Invalid or missing token"}).end();
        return;
    }

    var forgotPasswordProvider = new ForgotPasswordProvider(this.settings);
    forgotPasswordProvider.doRecoverActions(userData, function(err) {
        if(err) {
            return res.status(err.httpCode).json({error: err.errorCode, msg: err.message }).end();
        }
        res.status(200).json({ msg: responseOkMessage }).end();
    });
};

var checkUsername = function(username) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(username);
};

var checkDomain = function(domain) {
    return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
};

module.exports = ForgotPassword;
