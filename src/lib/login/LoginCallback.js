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

var log2out = require('log2out');
var RequestMeter = require('./RequestMeter');
var RequestLimit = require('./RequestLimit');
var LoginFinishedUnsuccessCallback = require('./LoginFinishedUnsuccessCallback');
var LoginResult = require('./LoginResult');
var LoginResultHandler = require('./LoginResultHandler');
var UserNotificator = require('../UserNotificator');

var LoginCallback = function(loginResultHandler, TID, userNotificator) {
    this.loginResultHandler = loginResultHandler;
    this.logger = log2out.getLogger('LoginCallback');
    this.tracer = log2out.getLogger('LoginCallback');
    this.tracer.setFormater('TransactionFormater');
    this.TID = TID;
    this.userNotificator = userNotificator || new UserNotificator();
};

LoginCallback.prototype.loginFinished = function(err, loginResult) {
    this.logger.debug("loginFinished: ", err,  loginResult);

    if (err) {
        if (err === LoginResult.INVALID_CREDENTIALS) {
            this.loginResultHandler.invalidCredentials(err, this.TID);
        } else {
            this.loginResultHandler.error(err);
        }
    } else {
        this.tracer.info('User', loginResult.principalId, 'Login success!', this.TID, 0);
        this.userNotificator.sendLoginSuccess(loginResult.principalId, this.TID);
        this.loginResultHandler.success(loginResult);
    }
};

module.exports = LoginCallback;
