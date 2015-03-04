/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32() //官邸等级
                    , reader.readUINT32()//粮仓数量
                    , reader.readUINT32()//银库数量
                    , reader.readUINT32()//农田数量
                    , reader.readUINT32()//民户数量
                    , reader.readUINT32()//校场数量
                    , reader.readUINT32()//牧场数量
                    , reader.readUINT32()//商铺数量
                    , reader.readUINT32()//工匠坊数量
                    , reader.readUINT32()//炼铁厂数量
                    , reader.readUINT32()//精铁库数量
        ];
        //API.info(API.encodeJson(info));
        result[info[0]] = info;
    }
    return result;
}
