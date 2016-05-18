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

var settings = require('../settings');
var userNotification = require('eyeos-usernotification');
var NEW_CARD_AVAILABLE = "newCardAvailable";

var SendCardToUser = function(restUtilsReply, notificationController) {
	this.restUtilsReply = restUtilsReply;
    this.notificationController = notificationController || new userNotification.NotificationController();
};

SendCardToUser.prototype.signed = function(card, signature) {
    var useUserExchange = true;
    var data = {
        card: card,
        signature: signature
    };

    var notification = new userNotification.Notification(NEW_CARD_AVAILABLE, data);

    this.notificationController.notifyUser(notification, card.username + '@' + card.domain, useUserExchange);

	this.restUtilsReply.end(JSON.stringify({
        type: NEW_CARD_AVAILABLE,
        data: data
    }));
};

SendCardToUser.prototype.unSigned = function() {
	this.restUtilsReply.fail(455);
};

module.exports = SendCardToUser;
