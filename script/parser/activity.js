/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = [];
    while (reader.remain()) {
        result.push([reader.readString16(), reader.readString16()]);
    }
    return result;
}
