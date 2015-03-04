/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    var index = 0;
    while (reader.remain()) {
        var info = [reader.readString16()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readString16()
                    , reader.readUINT32()
                    , index++
        ];
        //API.info(API.encodeJson(info));
        result[info[0]] = info;
    }
    return result;
}
