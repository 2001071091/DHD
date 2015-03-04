/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    while (reader.remain()) {
        var info = {
            id: reader.readUINT32()
            , name: reader.readString16()//名称
            , type: reader.readUByte()//枚举类型
            , type2: reader.readString16()//中文类型
            , type3: reader.readString16()//拼音类型
            , type4: reader.readString16()//
            , desc: reader.readString16()
            , country: reader.readString16()
            , others: [
                reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
                        , reader.readString16()
            ]
            , out: reader.readString16()
            , other: reader.readUINT16()
            , other2: reader.readUINT16()
        }
        result[info.name] = info;
    }
    return result;
}
