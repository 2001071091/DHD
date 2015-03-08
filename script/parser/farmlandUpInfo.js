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
INFO - API.info:[1,1,0,0,3,137,1]
INFO - API.info:[2,2,300,0,9,150,1]
INFO - API.info:[3,3,700,0,26,163,1]
INFO - API.info:[4,4,1200,0,120,176,1]
INFO - API.info:[5,5,1900,0,340,189,2]
INFO - API.info:[6,6,4000,0,950,202,2]
INFO - API.info:[7,7,5500,0,1740,217,2]
INFO - API.info:[8,8,7600,0,2820,232,2]
INFO - API.info:[9,9,10000,0,3600,247,3]
INFO - API.info:[10,10,15000,0,5100,262,3]
INFO - API.info:[11,11,20000,0,6600,279,3]
INFO - API.info:[12,12,27000,0,8400,296,4]
INFO - API.info:[13,13,40000,800,11100,313,4]
INFO - API.info:[14,14,54000,1300,14100,330,4]
INFO - API.info:[15,15,72000,2000,17400,347,5]
INFO - API.info:[16,16,95000,3000,19800,366,5]
INFO - API.info:[17,17,180000,4400,25200,385,5]
INFO - API.info:[18,18,230000,6300,32400,404,5]
INFO - API.info:[19,19,310000,9100,36000,423,5]
INFO - API.info:[20,20,410000,12000,45000,442,5]
 */

