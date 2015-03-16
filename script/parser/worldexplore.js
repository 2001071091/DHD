/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT16()
                    , reader.readUINT16()
                    , reader.readUINT16()
        ];
        //API.info(API.encodeJson(info));
        result.push(info);
    }
    return result;
}

/**
INFO - API.info:[1,1000,1]
INFO - API.info:[2,1000,4]
INFO - API.info:[3,2000,8]
INFO - API.info:[4,3000,10]
INFO - API.info:[5,3000,12]
INFO - API.info:[6,3000,15]
INFO - API.info:[7,4000,17]
INFO - API.info:[8,4000,20]
INFO - API.info:[9,6000,24]
INFO - API.info:[10,6000,27]
INFO - API.info:[11,7000,30]
INFO - API.info:[12,10000,33]
INFO - API.info:[13,10000,35]
INFO - API.info:[14,12000,37]
INFO - API.info:[15,13000,40]
INFO - API.info:[16,14000,42]
INFO - API.info:[17,16000,44]
INFO - API.info:[18,17000,46]
INFO - API.info:[19,18000,48]
INFO - API.info:[20,18000,50]
INFO - API.info:[21,19000,52]
INFO - API.info:[22,23000,54]
INFO - API.info:[23,24000,56]
INFO - API.info:[24,26000,58]
INFO - API.info:[25,28000,60]
INFO - API.info:[26,31000,63]
INFO - API.info:[27,32000,66]
INFO - API.info:[28,36000,69]
INFO - API.info:[29,37000,72]
INFO - API.info:[30,38000,75]
INFO - API.info:[31,41000,78]
INFO - API.info:[32,46000,81]
INFO - API.info:[33,53000,84]
INFO - API.info:[34,55000,87]
INFO - API.info:[35,60000,90]
INFO - API.info:[36,62000,93]
INFO - API.info:[37,464,96]
INFO - API.info:[38,1464,99]
INFO - API.info:[39,2464,102]
INFO - API.info:[40,8464,105]
INFO - API.info:[41,14464,108]
INFO - API.info:[42,17464,111]
INFO - API.info:[43,21464,114]
INFO - API.info:[44,31464,117]
INFO - API.info:[45,34464,120]
 */
