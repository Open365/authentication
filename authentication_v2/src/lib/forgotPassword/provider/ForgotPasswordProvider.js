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

var settings = require('../../settings');
var TokenGenerator = require('../../common/providers/TokenGenerator');
var EmailProvider = require('../../common/providers/EmailProvider');
var LdapProvider = require('../../common/providers/LdapProvider');
var ErrorHandler = require('../../common/providers/ErrorHandler');
var ForgotPasswordModel = require('../model/ForgotPasswordSchema');

var ForgotPasswordProvider = function (customSettings, emailProvider, ldapProvider, tokenGenerator, errorHandler) {
    this.settings = customSettings || settings;
    this.emailProvider = emailProvider || new EmailProvider(this.settings);
    this.ldapProvider = ldapProvider || new LdapProvider(this.settings);
    this.tokenGenerator = tokenGenerator || new TokenGenerator(this.settings);
    this.errorHandler = errorHandler || new ErrorHandler(this.settings);
};

ForgotPasswordProvider.prototype.doForgotActions = function(data, cb) {
    var self = this;

    this.tokenGenerator.generateHex(function(err, token) {
        if(!token) {
            cb(self.errorHandler.createErrorObject(400, 4, "Error generating token"));
            return;
        }
        data.token = token;
        self.setTokenPersistence(data, cb);
    });
};

ForgotPasswordProvider.prototype.doRecoverActions = function(data, cb) {
    var self = this;

    ForgotPasswordModel
        .findOne({ passwordResetToken: data.token, username: data.username })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
            if (err) {
                cb(self.errorHandler.createErrorObject(500, 4, err.message));
                return;
            }
            if (!user) {
                cb(self.errorHandler.createErrorObject(400, 3, "Password reset token is invalid or has expired"));
                return;
            }
            user.passwordResetToken = null;
            user.passwordResetExpires = null;
            user.save(function(err) {
                if(err) {
                    cb(new Error("Token cannot be invalidated"), 400);
                    return;
                }

                data.password = self.tokenGenerator.generateMd5(data.password);
                self.ldapProvider.setPassword(data, cb);
            });
        });
};

ForgotPasswordProvider.prototype.setTokenPersistence = function(data, cb) {
    var self = this;
    ForgotPasswordModel.findOne({ username: data.username }, function(err, user) {
        if (!user) {
            cb(self.errorHandler.createErrorObject(400, 1, "User not found with this username"));
            return;
        }
        user.passwordResetToken = data.token;
        user.passwordResetExpires = Date.now() + self.settings.token.expiration;
        user.save(function(err) {
            if(err) {
                console.error('Token cannot be saved on mongo: ', err);
                cb(self.errorHandler.createErrorObject(400, 4, "Token cannot be saved on mongo"));
                return;
            }
            data.personal_email = user.personal_email;
            self.emailProvider.sendForgotPasswordMail(data, cb)
        });
    });
};

module.exports = ForgotPasswordProvider;
