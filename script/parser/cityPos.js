/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = [];
    while (reader.remain()) {
        result[reader.readUINT16()]={
            name:reader.readString16()
            ,type:reader.readString16()
            ,x:reader.readUINT16()
            ,y:reader.readUINT16()
        }
        //API.debug(API.encodeJson(result[result.length-1]));
    }
    return result;
}
