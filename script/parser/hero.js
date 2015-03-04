/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    while (reader.remain()) {
        var info =[reader.readString16()
                    , reader.readString16()
                    , reader.readString16()
                    , reader.readString16()
                    , reader.readUINT32()
                    , reader.readString16()
                    , reader.readUByte()
                    , reader.readString16()
                    , reader.readUByte()
                    , reader.readString16()
                    , reader.readUINT16()
                    , reader.readUINT16()
                    , reader.readUByte()
                    , reader.readUINT32()
                    , reader.readString16()
                    , reader.readUINT32()
                    , reader.readUByte()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
        ];
        result[info[0]] = info;
        //API.info(API.encodeJson(info));
    }
    return result;
}
