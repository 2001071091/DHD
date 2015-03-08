function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
        ];
        //API.info(API.encodeJson(info));
        result.push(info);
    }
    return result;
}

/**
INFO - API.info:[1,12,0,0,15,20000,1]
INFO - API.info:[2,12,1700,0,45,30000,1]
INFO - API.info:[3,12,3500,0,140,40000,1]
INFO - API.info:[4,12,6000,0,760,50000,1]
INFO - API.info:[5,12,9200,0,1730,60000,2]
INFO - API.info:[6,12,19000,0,5400,70000,2]
INFO - API.info:[7,12,26000,0,9300,80000,2]
INFO - API.info:[8,12,36000,0,14100,90000,2]
INFO - API.info:[9,12,49000,0,19800,100000,3]
INFO - API.info:[10,12,74000,0,27000,110000,3]
INFO - API.info:[11,12,100000,0,36000,130000,3]
INFO - API.info:[12,12,130000,0,48600,160000,4]
INFO - API.info:[13,13,190000,2600,61200,200000,4]
INFO - API.info:[14,14,260000,4200,77400,250000,4]
INFO - API.info:[15,15,350000,6600,93600,400000,5]
INFO - API.info:[16,16,460000,9800,115200,600000,5]
INFO - API.info:[17,17,890000,14000,147600,800000,5]
INFO - API.info:[18,18,1180000,20000,178200,1000000,5]
INFO - API.info:[19,19,1560000,29000,208800,1500000,5]
INFO - API.info:[20,20,2080000,41000,264600,2000000,5]
 */

