function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32()
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
INFO - API.info:[7,10,2000,0]
INFO - API.info:[8,15,3000,0]
INFO - API.info:[9,15,4000,0]
INFO - API.info:[10,20,5000,0]
INFO - API.info:[11,20,6000,0]
INFO - API.info:[12,23,8000,0]
INFO - API.info:[13,23,10000,0]
INFO - API.info:[14,25,13000,0]
INFO - API.info:[15,25,16000,0]
INFO - API.info:[16,28,20000,0]
INFO - API.info:[17,31,24000,0]
INFO - API.info:[18,34,29000,0]
INFO - API.info:[19,37,35000,0]
INFO - API.info:[20,40,42000,0]
INFO - API.info:[21,43,50000,0]
INFO - API.info:[22,46,59000,0]
INFO - API.info:[23,49,70000,0]
INFO - API.info:[24,52,83000,0]
INFO - API.info:[25,55,97000,0]
INFO - API.info:[26,58,110000,0]
INFO - API.info:[27,61,130000,0]
INFO - API.info:[28,64,150000,0]
INFO - API.info:[29,67,180000,0]
INFO - API.info:[30,70,210000,0]
INFO - API.info:[31,73,250000,0]
INFO - API.info:[32,76,290000,0]
INFO - API.info:[33,79,340000,0]
INFO - API.info:[34,82,390000,0]
INFO - API.info:[35,85,460000,0]
INFO - API.info:[36,88,540000,0]
INFO - API.info:[37,91,630000,0]
INFO - API.info:[38,94,730000,0]
INFO - API.info:[39,97,850000,0]
INFO - API.info:[40,100,990000,0]
 */

