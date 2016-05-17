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

var PermissionMerger = function() {

};

PermissionMerger.prototype.merge = function(array1, array2) {
    var mergedArray = array1.concat(array2);

    for(var i = 0; i < mergedArray.length; ++i) {
        for(var j = i + 1; j < mergedArray.length; ++j) {
            if(mergedArray[i] === mergedArray[j])
                mergedArray.splice(j--, 1);
        }
    }

    return mergedArray;
};

PermissionMerger.prototype.subtract = function(array1, array2) {
    if ( !Array.isArray(array2) ){
        array2 = [array2];
    }
    return array1.filter(function(arr1Element){
                                    return array2.indexOf(arr1Element) === -1;
    });
};

module.exports = PermissionMerger;