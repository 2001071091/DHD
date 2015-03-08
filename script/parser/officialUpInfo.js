function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32()
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
INFO - API.info:[1,10,0,0,20,1]
INFO - API.info:[2,10,2700,0,60,1]
INFO - API.info:[3,10,5700,0,190,1]
INFO - API.info:[4,10,9700,0,970,1]
INFO - API.info:[5,25,15000,0,2580,2]
INFO - API.info:[6,25,31000,0,7200,2]
INFO - API.info:[7,25,44000,0,12900,2]
INFO - API.info:[8,30,61000,0,19800,2]
INFO - API.info:[9,45,84000,0,27000,3]
INFO - API.info:[10,50,120000,0,39600,3]
INFO - API.info:[11,55,170000,0,54000,3]
INFO - API.info:[12,60,230000,0,66600,4]
INFO - API.info:[13,65,340000,6100,86400,4]
INFO - API.info:[14,70,460000,10000,104400,4]
INFO - API.info:[15,75,620000,15000,133200,5]
INFO - API.info:[16,80,840000,24000,162000,5]
INFO - API.info:[17,85,1600000,35000,194400,5]
INFO - API.info:[18,90,2150000,51000,234000,5]
INFO - API.info:[19,90,2880000,74000,297000,5]
INFO - API.info:[20,90,3850000,106000,361800,5]
 */
