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
INFO - API.info:[1,1,0,0,6,100000,1]
INFO - API.info:[2,2,600,0,19,120000,1]
INFO - API.info:[3,3,1200,0,59,150000,1]
INFO - API.info:[4,4,2100,0,280,180000,1]
INFO - API.info:[5,5,3300,0,730,230000,2]
INFO - API.info:[6,6,7100,0,2160,270000,2]
INFO - API.info:[7,7,10000,0,3900,330000,2]
INFO - API.info:[8,8,14000,0,5700,400000,2]
INFO - API.info:[9,9,19000,0,9000,470000,3]
INFO - API.info:[10,10,30000,0,11100,560000,3]
INFO - API.info:[11,11,41000,0,15900,670000,3]
INFO - API.info:[12,12,56000,0,18000,800000,4]
INFO - API.info:[13,13,84000,1300,25200,950000,4]
INFO - API.info:[14,14,110000,2200,32400,1120000,4]
INFO - API.info:[15,15,150000,3600,37800,1330000,5]
INFO - API.info:[16,16,210000,5500,48600,1570000,5]
INFO - API.info:[17,17,400000,8200,57600,1860000,5]
INFO - API.info:[18,18,550000,12000,68400,2200000,5]
INFO - API.info:[19,19,740000,17000,84600,2600000,5]
INFO - API.info:[20,20,1000000,25000,108000,3100000,5]
 */