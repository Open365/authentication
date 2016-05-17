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

var SuccessfulLoginPostProcessor = require('../SuccessfulLoginPostProcessor');
function LoginSignCardCallback(credentials, responseFinisher, principal, succesfulLoginPostProcessorInjected) {
	this.credentials = credentials;
    this.responseFinisher = responseFinisher;
	this.principal = principal;
    this.successfulLoginPostProcessor = succesfulLoginPostProcessorInjected || new SuccessfulLoginPostProcessor();
}

LoginSignCardCallback.prototype.signed = function(card, signature, minicard, minisignature) {
    this.successfulLoginPostProcessor.success(
        this.credentials.getAuthInfo().getUsername(),
        this.credentials.getAuthInfo().getPassword(),
        card,
        signature,
		this.principal
    );
    this.responseFinisher.end({
		result: {
			success: true,
			card: card,
			signature: signature,
			minicard: minicard,
			minisignature: minisignature
		}
	});
};

LoginSignCardCallback.prototype.unSigned = function() {
	this.responseFinisher.end({
		status: 403
	});
};

module.exports = LoginSignCardCallback;
