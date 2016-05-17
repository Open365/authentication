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

var fs = require('fs');
var testFiles = [];
var testDirectory = './test';

getFiles(testDirectory, testFiles);
console.log(testFiles);
var Mocha = require('mocha');
var mocha = new Mocha;
mocha.reporter('spec').ui('tdd');
for (var i =0;i<testFiles.length;i++){
	mocha.addFile(testFiles[i]);
}
var runner = mocha.run(function(){
	console.log('finished');
});

function getFiles(testDirectory, testFiles) {
	var files = fs.readdirSync(testDirectory);
	for(var file in files){
		if (!files.hasOwnProperty(file)) continue;

		var name = testDirectory + '/' + files[file];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, testFiles);
		}else{
			testFiles.push(name);
		}
	}
}
