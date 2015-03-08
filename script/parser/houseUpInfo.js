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
INFO - API.info:[1,1,0,0,3,68,1]
INFO - API.info:[2,2,100,0,9,75,1]
INFO - API.info:[3,3,300,0,26,81,1]
INFO - API.info:[4,4,600,0,120,88,1]
INFO - API.info:[5,5,800,0,340,94,2]
INFO - API.info:[6,6,1800,0,950,101,2]
INFO - API.info:[7,7,2400,0,1740,108,2]
INFO - API.info:[8,8,3200,0,2820,116,2]
INFO - API.info:[9,9,4300,0,3600,123,3]
INFO - API.info:[10,10,6200,0,5100,131,3]
INFO - API.info:[11,11,8100,0,6600,139,3]
INFO - API.info:[12,12,10000,0,8400,148,4]
INFO - API.info:[13,13,14000,1200,11100,156,4]
INFO - API.info:[14,14,19000,1900,14100,165,4]
INFO - API.info:[15,15,24000,3000,17400,173,5]
INFO - API.info:[16,16,30000,4600,19800,183,5]
INFO - API.info:[17,17,56000,6700,25200,192,5]
INFO - API.info:[18,18,70000,9700,32400,202,5]
INFO - API.info:[19,19,88000,13000,36000,211,5]
INFO - API.info:[20,20,110000,19000,45000,221,5]
 */