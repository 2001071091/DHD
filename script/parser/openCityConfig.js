
function parser(reader) {
    var result = [];
    while (reader.remain()) {
        result.push([
            reader.readUINT32()
            ,reader.readUINT32()
                    , reader.readString16()
                    , reader.readString16()
                    , reader.readString16()
                    ,reader.readUINT32()
                    ,reader.readUINT16()
                     ,reader.readUINT32()
                     , reader.readString16()
                      , reader.readString16()
                      ,reader.readUINT32()

        ]);
        //API.info(API.encodeJson(result[result.length - 1]));
    }
    return result;
}