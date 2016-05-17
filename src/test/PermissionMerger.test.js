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

var sinon = require('sinon');
var assert = require('chai').assert;
var PermissionMerger = require('../lib/permissions/PermissionsMerger');

suite('PermissionMerger', function(){
	var sut;

	var array1 = ['a', 'b', 'c', 'd', 99];
	var array2 = [1, 2, 3, 4, 5, 'a'];

	var mergedArrays = ['a', 'b', 'c', 'd', 99, 1, 2, 3, 4, 5];

	setup(function(){
		sut = new PermissionMerger();
	});

	suite('#merge', function(){
		test('Should return an unified array of permissions', function(){
			var result = sut.merge(array1, array2);
			assert.deepEqual(result, mergedArrays);
		});
	});

    suite('#subtract', function(){
        test('Should remove elements in second array from first array', function(){
            var array3 = ['a', 'b', 'z'];

            var result = sut.subtract(array1, array3);

            result.forEach(function(element) {
                assert.include(array1, element, "all result elements should be element of array1");
            });

            array3.forEach(function(element) {
                assert.notInclude(result, element, "NO element in array3 should be element of result");
            });
        });

        test('Should remove numeric 2nd parameters from first array', function(){
            var nonArray = 99;

            var result = sut.subtract(array1, nonArray);

            assert.include(array1, nonArray, "nonArray should not be an element of result");
            assert.notInclude(result, nonArray, "nonArray should not be an element of result");
        });

        test('Should remove string 2nd parameters from first array', function(){
            var nonArray = 'a';

            var result = sut.subtract(array1, nonArray);

            assert.include(array1, nonArray, "nonArray should not be an element of result");
            assert.notInclude(result, nonArray, "nonArray should not be an element of result");
        });


    });
});