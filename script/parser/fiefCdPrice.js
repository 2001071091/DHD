function parser(reader) {
    var result = [];
    while (reader.remain()) {
        var info = [reader.readUINT32()
                    , reader.readString16()
        ];
        //API.info(API.encodeJson(info));
        result.push(info);
    }
    return result;
}
/**
INFO - API.info:[0,"3"]
INFO - API.info:[10,"2"]
INFO - API.info:[30,"1"]
INFO - API.info:[60,"0.5"]
INFO - API.info:[180,"0.2"]
INFO - API.info:[720,"0.1"]
 */

