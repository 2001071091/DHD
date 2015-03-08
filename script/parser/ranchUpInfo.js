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
INFO - API.info:[1,5,0,0,11,274,1]
INFO - API.info:[2,5,1400,0,31,300,1]
INFO - API.info:[3,5,3000,0,100,326,1]
INFO - API.info:[4,5,5000,0,520,352,1]
INFO - API.info:[5,5,7700,0,1350,378,2]
INFO - API.info:[6,6,16000,0,3900,404,2]
INFO - API.info:[7,7,22000,0,6900,434,2]
INFO - API.info:[8,8,30000,0,10800,464,2]
INFO - API.info:[9,9,41000,0,14400,494,3]
INFO - API.info:[10,10,61000,0,19800,524,3]
INFO - API.info:[11,11,82000,0,25200,558,3]
INFO - API.info:[12,12,110000,0,34200,592,4]
INFO - API.info:[13,13,160000,3200,41400,626,4]
INFO - API.info:[14,14,210000,5200,55800,660,4]
INFO - API.info:[15,15,280000,8100,68400,694,5]
INFO - API.info:[16,16,380000,12000,81000,732,5]
INFO - API.info:[17,17,720000,17000,100800,770,5]
INFO - API.info:[18,18,950000,25000,120600,808,5]
INFO - API.info:[19,19,1260000,36000,149400,846,5]
INFO - API.info:[20,20,1670000,51000,192600,884,5]
 */