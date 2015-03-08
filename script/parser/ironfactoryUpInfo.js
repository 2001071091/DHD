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
INFO - API.info:[1,12,0,0,10,21,1]
INFO - API.info:[2,12,1200,0,28,23,1]
INFO - API.info:[3,12,2400,0,90,26,1]
INFO - API.info:[4,12,4100,0,440,29,1]
INFO - API.info:[5,12,6400,0,1130,32,2]
INFO - API.info:[6,12,13000,0,3360,35,2]
INFO - API.info:[7,12,18000,0,5700,38,2]
INFO - API.info:[8,12,26000,0,9300,41,2]
INFO - API.info:[9,12,35000,0,12300,45,3]
INFO - API.info:[10,12,53000,0,16800,49,3]
INFO - API.info:[11,12,72000,0,23400,53,3]
INFO - API.info:[12,12,97000,0,28800,57,4]
INFO - API.info:[13,13,140000,760,36000,62,4]
INFO - API.info:[14,14,190000,1200,45000,67,4]
INFO - API.info:[15,15,260000,1800,55800,72,5]
INFO - API.info:[16,16,350000,2700,72000,77,5]
INFO - API.info:[17,17,670000,3900,90000,83,5]
INFO - API.info:[18,18,890000,5500,106200,89,5]
INFO - API.info:[19,19,1190000,7700,136800,95,5]
INFO - API.info:[20,20,1590000,10000,165600,101,5]
 */