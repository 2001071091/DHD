/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    var index =0;
    while (reader.remain()) {
        var info = [
            reader.readUINT32()
                    , reader.readString16()
                    ,reader.readUINT32()
                    , reader.readString16()
                    , reader.readString16()
                    , reader.readString16()
                    , reader.readString16()
                    ,reader.readUINT16()
                    ,reader.readString16()
                    ,reader.readString16()
                     ,reader.readString16()
                     ,index++
        ];
        var name =info[4].split("=")[1];
        result[name] =info;
        API.info(API.encodeJson(info));
    }
    return result;
}
