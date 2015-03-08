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
INFO - API.info:[1,5,0,0,11,137,1]
INFO - API.info:[2,5,700,0,31,150,1]
INFO - API.info:[3,5,1400,0,100,163,1]
INFO - API.info:[4,5,2400,0,520,176,1]
INFO - API.info:[5,5,3500,0,1350,189,2]
INFO - API.info:[6,6,7200,0,3900,202,2]
INFO - API.info:[7,7,9800,0,6900,217,2]
INFO - API.info:[8,8,13000,0,10800,232,2]
INFO - API.info:[9,9,17000,0,14400,247,3]
INFO - API.info:[10,10,25000,0,19800,262,3]
INFO - API.info:[11,11,32000,0,25200,279,3]
INFO - API.info:[12,12,41000,0,34200,296,4]
INFO - API.info:[13,13,59000,4800,41400,313,4]
INFO - API.info:[14,14,76000,7900,55800,330,4]
INFO - API.info:[15,15,97000,12000,68400,347,5]
INFO - API.info:[16,16,120000,18000,81000,366,5]
INFO - API.info:[17,17,220000,27000,100800,385,5]
INFO - API.info:[18,18,280000,38000,120600,404,5]
INFO - API.info:[19,19,350000,55000,149400,423,5]
INFO - API.info:[20,20,440000,79000,192600,442,5]
 */

