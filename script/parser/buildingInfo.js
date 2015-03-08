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
/**
INFO - API.info:["官邸",0,1,20,0,0,"官邸决定了其他建筑的等级上限，封地建筑无法超过官府等级。",2,0]
INFO - API.info:["粮仓",0,2,20,1800,0,"粮仓决定了粮草的上限",2,1]
INFO - API.info:["银库",0,3,20,1800,0,"银库决定了银两的上限",2,2]
INFO - API.info:["农田",0,4,20,700,0,"农田用于产出粮草",2,3]
INFO - API.info:["民户",0,5,20,700,0,"民户用于产出银两",2,4]
INFO - API.info:["校场",0,6,20,1300,0,"校场用来练兵，提升英雄的经验",2,5]
INFO - API.info:["牧场",0,7,20,3400,0,"牧场能够产出更多粮草",2,6]
INFO - API.info:["商铺",0,8,20,3400,0,"商铺能够产出更多银两",2,7]
INFO - API.info:["工匠坊",0,9,20,1900,0,"工匠坊可以派遣英雄，生产军械",2,8]
INFO - API.info:["炼铁厂",0,12,20,3600,0,"炼铁厂用于产出精铁",2,9]
INFO - API.info:["精铁库",0,13,20,5300,0,"精铁库决定了精铁的上限",2,10]
 */
