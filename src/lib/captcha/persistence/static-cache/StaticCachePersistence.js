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

var Request = require('request'),
    Settings = require('../../../settings'),
    log2out = require('log2out'),
    StaticCacheUrlExtractor = require('./StaticCacheUrlExtractor');

var StaticCacheProvider = function(request, settings, callback) {
    this.staticCacheUrlExtractor = new StaticCacheUrlExtractor();
    this.request = request || Request;
    this.settings = settings || Settings;
    this.callback = callback || function () {};
    this.logger = log2out.getLogger('StaticCachePersistence');
    this.persistenceSettings = this.settings.captcha.blobStorage.persistence;
};

StaticCacheProvider.prototype = {
    getType: function () {
        return "static-cache";
    },

    save: function (persistenceAsyncHandler, blob) {
        var url = this.persistenceSettings.url + ':' + this.persistenceSettings.port + '/items';
        var blobBase64 = blob.toString('base64');
        var params = {
            url: url,
            form: {
                blob: blobBase64,
                mimetype: this.settings.captcha.mimetype,
                expiration: this.settings.captcha.blobStorage.persistence.expiration
            }
        };
        this.request.post(params, this.staticCacheUrlExtractor.extract.bind(this, persistenceAsyncHandler));
    }
};

module.exports = StaticCacheProvider;
