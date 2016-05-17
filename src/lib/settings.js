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

var Settings = {
	defaultDomain: environment.DEFAULT_DOMAIN || "open365.io",
	loginQueue: {
		type: environment.EYEOS_AUTHENTICATION_LOGINQUEUE_TYPE || "amqp",
		hosts: environment.EYEOS_AUTHENTICATION_LOGINQUEUE_HOSTS || 'rabbit.service.consul:5672', //'192.168.7.39',
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
		queue: {
			name: environment.EYEOS_AUTHENTICATION_LOGINQUEUE_QUEUE_NAME || 'login.v1',
			durable: true,
			exclusive: false,
			autoDelete: false
		},
		subscription: {
			ack: true,
			prefetchCount: parseInt(environment.AUTHENTICATION_PREFETCH_COUNT, 10) || 0
		}
	},
	captchaQueue: {
		type: environment.EYEOS_AUTHENTICATION_CAPTCHAQUEUE_TYPE || "amqp",
		hosts: environment.EYEOS_AUTHENTICATION_CAPTCHAQUEUE_HOSTS || 'rabbit.service.consul:5672', //'192.168.7.39',
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
		queue: {
			name: environment.EYEOS_AUTHENTICATION_CAPTCHAQUEUE_QUEUE_NAME || 'captcha.v1',
			durable: true,
			exclusive: false,
			autoDelete: false
		},
		subscription: {
			ack: true,
			prefetchCount: parseInt(environment.AUTHENTICATION_PREFETCH_COUNT, 10) || 0
		}
	},
	permissionsQueue: {
		type: environment.EYEOS_AUTHENTICATION_PERMISSIONSQUEUE_TYPE || "amqp",
		hosts: environment.EYEOS_AUTHENTICATION_PERMISSIONSQUEUE_HOSTS || 'rabbit.service.consul:5672', //'192.168.7.39',
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
		queue: {
			name: 'permissions.v1',
			durable: true,
			exclusive: false,
			autoDelete: false
		},
		subscription: {
			ack: true,
			prefetchCount: parseInt(environment.AUTHENTICATION_PREFETCH_COUNT, 10) || 0
		}
	},
	loginProvider: environment.EYEOS_AUTHENTICATION_LOGINPROVIDER || "ldap",
	captchaClient: environment.EYEOS_AUTHENTICATION_CAPTCHAPROVIDER || "default",
	ldap: {
		URL: environment.EYEOS_AUTHENTICATION_LDAP_URL || 'ldap://ldap.service.consul',
		DN: environment.EYEOS_AUTHENTICATION_LDAP_DN || 'ou=People,dc=eyeos,dc=com',
		LDAPAttrMap: {
			"principalId": environment.EYEOS_AUTHENTICATION_LDAP_PROPERTY_PRINCIPALID || "cn",
			"lastName": environment.EYEOS_AUTHENTICATION_LDAP_PROPERTY_LASTNAME || "sn",
			"firstName": environment.EYEOS_AUTHENTICATION_LDAP_PROPERTY_FIRSTNAME || "givenName"
		},
		timeout: environment.EYEOS_AUTHENTICATION_LDAP_TIMEOUT || 500,
		connectTimeout: environment.EYEOS_AUTHENTICATION_LDAP_CONNECT_TIMEOUT || 500
	},
	persistence: {
		type: environment.EYEOS_AUTHENTICATION_PERSISTENCE_TYPE || 'mongo'
	},
	bruteForcePrevention: {
		enabled: environment.EYEOS_AUTHENTICATION_BRUTEFORCEPREVENTION_ENABLED  === "true" || false,
		attemps: environment.EYEOS_AUTHENTICATION_BRUTEFORCEPREVENTION_ATTEMPTS || 3
	},
	mongoInfo: {
		type: environment.EYEOS_AUTHENTICATION_MONGOINFO_TYPE || "mongo",
		host: environment.EYEOS_AUTHENTICATION_MONGOINFO_HOST || 'mongo.service.consul', //'192.168.7.39',
		port: environment.EYEOS_AUTHENTICATION_MONGOINFO_PORT || 27017,
		db: environment.EYEOS_AUTHENTICATION_MONGOINFO_DB || 'eyeos'
	},
	stompServer: {
		host: environment.EYEOS_VDI_SERVICE_USERQUEUE_HOST || 'rabbit.service.consul',
		port: environment.EYEOS_VDI_SERVICE_USERQUEUE_PORT || 61613,
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		passcode: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword'
	},
	userQueue: {
		host: environment.EYEOS_VDI_SERVICE_USERQUEUE_HOST || 'rabbit.service.consul',
		port: environment.EYEOS_VDI_SERVICE_USERQUEUE_PORT || 61613,
		login: environment.EYEOS_BUS_MASTER_USER || 'guest',
		passcode: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword'
    },
	captcha: {
		mimetype: environment.EYEOS_AUTHENTICATION_CAPTCHA_MIMETYPE || "image/png",
		blobStorage: {
			persistence: {
				type: environment.EYEOS_AUTHENTICATION_CAPTCHA_BLOBSTORAGE_PERSISTENCE_TYPE || "static-cache",
				url: environment.EYEOS_AUTHENTICATION_CAPTCHA_BLOBSTORAGE_PERSISTENCE_URL || "http://cache.service.consul",
				port: environment.EYEOS_AUTHENTICATION_CAPTCHA_BLOBSTORAGE_PERSISTENCE_PORT || "9909",
				expiration: environment.EYEOS_AUTHENTICATION_CAPTCHA_BLOBSTORAGE_PERSISTENCE_EXPIRATION || 300 // 5 minutes.
			}
		},
		validationStorage: {
			persistence: {
				type: environment.EYEOS_AUTHENTICATION_CAPTCHA_VALIDATIONSTORAGE_PERSISTENCE_TYPE || "mongo",
				collection: environment.EYEOS_AUTHENTICATION_CAPTCHA_VALIDATIONSTORAGE_PERSISTENCE_COLLECTION || "captchaValidation",
				expireAfterSeconds: environment.EYEOS_AUTHENTICATION_CAPTCHA_VALIDATIONSTORAGE_PERSISTENCE_EXPIREAFTERSECONDS || 300
			}
		},
		height: environment.EYEOS_AUTHENTICATION_CAPTCHA_HEIGHT || 64,
		width: environment.EYEOS_AUTHENTICATION_CAPTCHA_WIDTH || 264
	},
	requestFilter: {
		login: {
			requestLimit: environment.EYEOS_AUTHENTICATION_LOGIN_REQUEST_LIMIT || 3
		}
	},
	successfulLogin: {
		exchange: {
			postUrl:  environment.EYEOS_AUTHENTICATION_LOGIN_EXCH_URL || 'amqp.exchange.login://presence/v1/userEvent/login/',
			type: environment.EYEOS_AUTHENTICATION_LOGIN_EXCH_TYPE || "amqp",
			host: environment.EYEOS_AUTHENTICATION_LOGIN_EXCH_HOST || 'rabbit.service.consul',
			port: environment.EYEOS_AUTHENTICATION_LOGIN_EXCH_PORT || 5672,
			login: environment.EYEOS_BUS_MASTER_USER || 'guest',
			password: environment.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
			options:  {
				durable: true,
				exclusive: false,
				autoDelete: true
			}
		},
		crypto: {
			type: 'rsa',
			rsa: {
				public: __dirname + "/rsa-keys/key.pub"
			}
		}
	},
	validateLicense: environment.OPEN365_LICENSE === 'true',
	administratorUsername: environment.ADMINISTRATOR_USERNAME,
	mustChangePassword: environment.EYEOS_PRINCIPAL_MUST_CHANGE_PASSWORD === "true" || false
};

module.exports = Settings;
