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

var Settings = {
	loginProvider: "ldap",
	ldap: {
		URL: 'ldap://127.0.0.1:1389',
		DN: 'ou=People,dc=eyeos,dc=org',
		LDAPAttrMap: {
			"principalId": "cn"
		}
	},
	persistence: {
		type: 'dummy'
	},
	requestFilter: {
		dummy: {
			requestLimit: 5
		}
	},
	mongoInfo: {
		type: "mongo",
		host: 'localhost',
		port: 27017,
		db: 'eyeos'
	},
    captcha: {
        mimetype: "a mimetype",
        dummyStorage: {
            persistence: {
                type: 'dummy'
            }
        },
		validationStorage: {
			persistence: {
				expireAfterSeconds: 300
			}
		},
        blobStorage: {
            persistence: {
                type: "fakePersistanceService",
                url: "fakeurl",
                port: "fakeport",
                expiration: 999 // 10 hrs.
            }
        }
    }
};

module.exports = Settings;
