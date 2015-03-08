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
                    , reader.readUINT32()
        ];
        //API.info(API.encodeJson(info));
        result.push(info);
    }
    return result;
}

/**
INFO - API.info:[1,2,0,0,6,1000,7200,1]
INFO - API.info:[2,2,400,0,18,1500,7800,1]
INFO - API.info:[3,3,900,0,56,2000,8400,1]
INFO - API.info:[4,4,1600,0,280,2500,9000,1]
INFO - API.info:[5,5,2600,0,690,3000,9600,2]
INFO - API.info:[6,6,5900,0,2160,3500,10200,2]
INFO - API.info:[7,7,8700,0,3600,4000,10800,2]
INFO - API.info:[8,8,12000,0,5700,4500,11400,2]
INFO - API.info:[9,9,18000,0,8100,5000,12000,3]
INFO - API.info:[10,10,28000,0,11100,5600,12600,3]
INFO - API.info:[11,11,40000,0,15000,6200,13200,3]
INFO - API.info:[12,12,56000,0,18000,6900,13800,4]
INFO - API.info:[13,13,87000,1000,23400,7600,14400,4]
INFO - API.info:[14,14,120000,1800,30600,8400,15000,4]
INFO - API.info:[15,15,160000,2900,37800,9200,15600,5]
INFO - API.info:[16,16,230000,4700,45000,10000,16200,5]
INFO - API.info:[17,17,450000,7300,55800,10800,16800,5]
INFO - API.info:[18,18,630000,11000,70200,11600,17400,5]
INFO - API.info:[19,19,870000,16000,88200,12400,18000,5]
INFO - API.info:[20,20,1200000,24000,106200,13200,18600,5]
 */