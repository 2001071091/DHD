/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    while (reader.remain()) {
        var info = [
            reader.readUINT32()
                    , reader.readString16()
                    ,reader.readUINT32()
                  ,reader.readUINT32()
                  ,reader.readUINT32()
                  ,reader.readUINT32()
                  ,reader.readUINT32()
                  ,reader.readUINT32()
                  , reader.readString16()
        ];
        API.info(API.encodeJson(info));
    }
    return result;
}
