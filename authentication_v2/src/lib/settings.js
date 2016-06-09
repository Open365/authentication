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

var environment = process.env;

var settings = {
	httpServer: {
		path: '/password/v1/',
		host: 'localhost',
		port: environment.AUTHENTICATION_V2_PORT || 8086
	},
	amqpServer: {
		host: 'rabbit.service.consul',
		port: 5672,
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
		prefetchCount: parseInt(environment.AUTHENTICATION_PREFETCH_COUNT, 10) || 0,
		queues: [
			'password.v1'
		]
	},
	persistence: {
		host: environment.EYEOS_AUTHENTICATION_MONGOINFO_HOST || 'mongo.service.consul',
		port: environment.EYEOS_AUTHENTICATION_MONGOINFO_PORT || 27017,
		db: environment.EYEOS_AUTHENTICATION_MONGOINFO_DB || 'eyeos'
	},
	emailProvider: {
		host: environment.EYEOS_AUTHENTICATION_MAIL_HOST || 'mailserver.service.consul',
		port: environment.EYEOS_AUTHENTICATION_MAIL_PORT || 25,
		noreplyAccount: {
            username: environment.EYEOS_AUTHENTICATION_MAIL_NOREPLY_USER || 'noreply',
            password: environment.EYEOS_AUTHENTICATION_MAIL_NOREPLY_PASSWORD || 'noreply'
		}
	},
	token: {
		size: 30,
		expiration: +environment.EYEOS_AUTHENTICATION_EXPIRATION_TOKEN || 3600000 // 1 hour
	},
	ldap: {
		url: environment.EYEOS_AUTHENTICATION_LDAP_URL || 'ldap://ldap.service.consul',
		admin: {
			user: environment.EYEOS_AUTHENTICATION_LDAP_ADMIN_USER,
			password: environment.EYEOS_AUTHENTICATION_LDAP_ADMIN_PASSWORD
		},
		base: environment.EYEOS_AUTHENTICATION_LDAP_DN || 'ou=People,dc=eyeos,dc=com'
	},
	password: {
		minLength: 8
	},
	supportedLanguages: [
		'en',
		'es',
		'it'
	]
};

module.exports = settings;
