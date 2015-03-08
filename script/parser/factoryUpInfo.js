function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readUINT32()
                    , reader.readString16()
        ];
        //API.info(API.encodeJson(info));
        result.push(info);
    }
    return result;
}

/**
INFO - API.info:[1,1,0,0,8,1,"黄金=10"]
INFO - API.info:[2,2,600,0,24,1,"黄金=10"]
INFO - API.info:[3,3,1300,0,70,1,"黄金=10"]
INFO - API.info:[4,4,2400,0,370,1,"黄金=10"]
INFO - API.info:[5,5,3900,0,930,2,"黄金=10"]
INFO - API.info:[6,6,8500,0,2880,2,"黄金=10"]
INFO - API.info:[7,7,12000,0,4800,2,"黄金=10"]
INFO - API.info:[8,8,17000,0,7800,2,"黄金=10"]
INFO - API.info:[9,9,24000,0,11400,3,"黄金=10"]
INFO - API.info:[10,10,38000,0,14700,3,"黄金=10"]
INFO - API.info:[11,11,54000,0,19800,3,"黄金=10"]
INFO - API.info:[12,12,74000,0,25200,4,"黄金=10"]
INFO - API.info:[13,13,110000,1500,32400,4,"黄金=10"]
INFO - API.info:[14,14,150000,2600,39600,4,"黄金=10"]
INFO - API.info:[15,15,210000,4300,50400,5,"黄金=10"]
INFO - API.info:[16,16,290000,6700,64800,5,"黄金=10"]
INFO - API.info:[17,17,580000,10000,75600,5,"黄金=10"]
INFO - API.info:[18,18,800000,15000,90000,5,"黄金=10"]
INFO - API.info:[19,19,1100000,22000,115200,5,"黄金=10"]
INFO - API.info:[20,20,1500000,33000,142200,5,"黄金=10"]
 */