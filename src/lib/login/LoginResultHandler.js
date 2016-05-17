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
var LoginSuccessCallback = require('./LoginSuccessCallback');
var LoginFinishedUnsuccessCallback = require('./LoginFinishedUnsuccessCallback');
var RequestMeter = require('./RequestMeter');
var RequestLimit = require('./RequestLimit');
var PrincipalProvider = require('../principals/PrincipalProvider');
var declareUserQueue = require('../declareUserQueue');
var settings = require("../settings");

var LoginResultHandler = function(credentials, responseFinisher, requestMeter, requestLimit, principalProvider, tracer, injectDeclareUserQueue) {
    this.responseFinisher = responseFinisher;
    this.logger = log2out.getLogger('LoginResultHandler');
    this.tracer = tracer || log2out.getLogger('LoginResultHandler');
    this.tracer.setFormater('TransactionFormater');
    this.requestMeter = requestMeter || new RequestMeter();
    this.requestLimit = requestLimit || new RequestLimit();
	this.principalProvider = principalProvider || new PrincipalProvider();
    this.requestCredentials = credentials;
    this.declareUserQueue = injectDeclareUserQueue || declareUserQueue;
};

LoginResultHandler.prototype.success = function(principal) {
    var logger = this.logger;
    var self = this;
    logger.debug('.loginFinished successfully [', principal, ']');
    var username = this.requestCredentials.getAuthInfo().getUsername();
    this.requestMeter.clear(this.requestCredentials.getAuthInfo().getFullUsername(), 'login');
    var queuename = this.requestCredentials.getAuthInfo().getFullUsername();

    this.declareUserQueue(queuename, function(error, queue){
        if (error) {
            var errMsg = 'Error trying to declare queue for successfully authenticated user: ' + username + ' error: ' + error;
            self.responseFinisher.end({err: new Error(errMsg)});
            logger.error('Exiting due to error: ' + errMsg);
            process.exit(1);
            return;
        }

        queue.close();
        logger.debug('Successfully created queue for user:', username, queue.name);
        var loginSuccessCallback = new LoginSuccessCallback(self.requestCredentials, self.responseFinisher);
        self.principalProvider.updatePrincipal(principal, loginSuccessCallback.success.bind(loginSuccessCallback));
        return;
    });


};

LoginResultHandler.prototype.invalidCredentials = function(loginResult, TID) {
    this.logger.debug('.loginFinished {code:', loginResult.status, 'message:', loginResult.message, '}');
    var self = this;
    this.requestMeter.increment(this.requestCredentials.getAuthInfo().getFullUsername(), 'login', {
        requestIncremented: function() {
            self.logger.debug('incremented requestMeter.request for login.', arguments);

            self.requestLimit.reached(self.requestCredentials.getAuthInfo().getFullUsername(), 'login', new LoginFinishedUnsuccessCallback(self.responseFinisher, loginResult));

            self.requestMeter.get(self.requestCredentials.getAuthInfo().getFullUsername(), 'login', {
                gotRequest: function(tries) {
                   self.tracer.info('User', self.requestCredentials.getAuthInfo().getFullUsername(), 'Login failed! Number of tries:', tries, TID, 0);
                }
            });
        }
    });
};

LoginResultHandler.prototype.error = function(loginResult) {
    this.logger.debug('.loginFinished unsuccessfully {code:', loginResult.status, 'message:', loginResult.message, '}');
    this.responseFinisher.end({err: loginResult.status});
};

module.exports = LoginResultHandler;
