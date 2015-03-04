/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = {};
    while (reader.remain()) {
        result[reader.readString16()] = {
            remote: reader.readUByte() == 1 ? true : false//远程
            , horse: reader.readUByte() == 1 ? true : false//骑兵
            , shield: reader.readUByte() == 1 ? true : false//持盾
            , heavy: reader.readUByte() == 1 ? true : false//重甲
            , move: reader.readUByte() == 1 ? false : true//不移动
            , type: reader.readString16()
            , index: reader.readUINT32()
            , des: reader.readString16()//描述
            , abilitys: [reader.readString16(), reader.readString16(), reader.readString16(), reader.readString16()]//能力
            , others: [reader.readUINT32(), reader.readUINT32(), reader.readUINT32(), reader.readUINT32()]
        }
    }
    return result;
}
