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

var fs = require('fs');
var settings = require('../../settings');
var ErrorHandler = require('../../common/providers/ErrorHandler');

var EmailProvider = function (customSettings, nodeMailer, errorHandler) {
    this.settings = customSettings || settings;
    this.nodeMailer = nodeMailer || require('nodemailer');
    this.errorHandler = errorHandler || new ErrorHandler(this.settings);
};

EmailProvider.prototype.sendForgotPasswordMail = function(data, cb) {
    var self = this;
    var template_dir = __dirname + '/../../../templates/forgotpassword/';
    var noreplyUser = this.settings.emailProvider.noreplyAccount.username + '@' + data.domain;
    var transporter = this.nodeMailer.createTransport({
        host: this.settings.emailProvider.host,
        port: this.settings.emailProvider.port,
        ignoreTLS: true,
        auth: {
            user: noreplyUser,
            pass: this.settings.emailProvider.noreplyAccount.password
        }
    });
    var mailOptions = {
        from: '"' + data.domain.charAt(0).toUpperCase() + data.domain.slice(1) + '" <' + noreplyUser + '>',
        to: data.personal_email,
        subject: 'Reset your password on ' + data.domain
    };
    mailOptions.html = fs.readFileSync(template_dir + 'forgot_password_' + data.lang + '.html').toString('utf8');
    mailOptions.html = mailOptions.html.replace('%DOMAIN%', data.domain);
    mailOptions.html = mailOptions.html.replace('%HOST%', data.domain);
    mailOptions.html = mailOptions.html.replace('%USERNAME%', data.username);
    mailOptions.html = mailOptions.html.replace('%TOKEN%', data.token);

    mailOptions.attachments = [{
        filename: 'open365.png',
        path: template_dir + 'open365.png',
        cid: 'open365.png'
    }, {
        filename: 'facebook.png',
        path: template_dir + 'facebook.png',
        cid: 'facebook.png'
    }, {
        filename: 'twitter.png',
        path: template_dir + 'twitter.png',
        cid: 'twitter.png'
    }];

    transporter.sendMail(mailOptions, function(err) {
        if(err) {
            console.log('Sending mail errror:', err);
            cb(self.errorHandler.createErrorObject(400, 4, "Problems sending email with reset password instructions"));
            return;
        }
        cb(null);
    });
};

module.exports = EmailProvider;
