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

var ExtraController = require('eyeos-extra').Controller;
var PrincipalProviderV2 = require('eyeos-principal').PrincipalProvider;
var ExtraKProvider = require('./ExtraKProvider');
var global_settings = require('../settings.js');


// IMPORTANT: Extra is the codename for license, so this class filters by license
// IMPORTANT: Extra is the codename for license, so this class filters by license
// IMPORTANT: Extra is the codename for license, so this class filters by license

var ExtraFilter = function(PrincipalSingleton, SystemGroupsSingleton, extraController, principalProvider, settings) {
    this.date = 'ce';
    var extract  = 'li';
    this.PrincipalSingleton = PrincipalSingleton || require('../principals/PrincipalSingleton');
    this.SystemGroupsSingleton = SystemGroupsSingleton || require('../principals/SystemGroupsSingleton');
    this.system = 'ns';
    var name = extract + this.date + this.system + 'e';
    this.path = __dirname+"/../../../" + name + "/" + name;
    this.extraK = ExtraKProvider.getExtraK();
    this.extraController = extraController || new ExtraController();
    this.principalProviderV2 = principalProvider || new PrincipalProviderV2(this.PrincipalSingleton.getInstance(), this.SystemGroupsSingleton.getInstance());
    this.settings = settings || global_settings;
};


// This method checks if the number of registered users has exceded the limit in the license
ExtraFilter.prototype.check = function(userId, host, callback) {
    if (!this.settings.validateLicense) {
        return callback(true);
    }
    try {
        this.extra = this.extraController.getExtra(this.path, this.extraK);
    }catch(e){
        return callback(false);
    }

    var splitedUrl = host.split(':');
    var extraUrl = this.extra.getUrl();
    if (splitedUrl[0] !== extraUrl && extraUrl !== '*') {
        callback(false);
        return;
    }
    var self = this;
    this.principalProviderV2.getPrincipalById(userId, function(err, obj) {
        if(!obj) {
            self.principalProviderV2.getNumPrincipals(function(numUsers) {
                var limit = self.extra.getLimit();
                if(numUsers < limit) {
                    return callback(true);
                } else {
                    return callback(false);
                }
            });
        } else {
            return callback(true);
        }
    });
};


module.exports = ExtraFilter;
