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

var LoginResult = function(success, message, status) {
    this.success = success;
    this.message = message;
    this.status = status;
};

LoginResult.SUCCESS = new LoginResult(true, "Login Successful", 200);
LoginResult.CONNECTION_ERROR = new LoginResult(false, "Connection Error", 503);
LoginResult.INVALID_CREDENTIALS = new LoginResult(false, "Invalid Credentials", 403);
LoginResult.TOO_MANY_REQUESTS = new LoginResult(false, "Too Many Requests", 429);

module.exports = LoginResult;