/* 
 * 封地
 */
var types = {
    "官邸": "OFFICE"
    , "粮仓": "LC"
    , "银库": "YK"
    , "农田": "NT"
    , "民户": "MH"
    , "校场": "XC"
    , "牧场": "MC"
    , "商铺": "SP"
    , "工匠坊": "GJF"
    , "炼铁厂": "LTC"
    , "精铁库": "JTC"
};

//建造优先级
var prior = ["牧场"
            , "商铺"
            , "农田"
            , "民户"];

function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.manor_nextTime == null)
        client.props.manor_nextTime = 0;
    if (now < client.props.manor_nextTime) {
        return false;
    }
    client.info("-----处理封地");

    var num_config = API.context.getConfig("buildingNumInfo");//可建造数量设置
    var config = API.context.getConfig("buildingInfo");//建筑信息

    var ret;
    //{"act":"Manor.getManorInfo","sid":"d883597992ae536fb03c339254f99cef422003e8"}
    ret = client.sendAct("Manor.getManorInfo");
    //client.info(API.encodeJson(ret));
    var fields = ret.fields;
    var buildings = ret.buildings;//{field:?,type:"OFFICE"/"LC"/"YK/"NT"/"MH",leve:?,levelSeconds:?,heroIndex:?,leftSeconds:?,products:?,produceSeconds:?}
    var incpercent = ret.incpercent;//{resource:"SILVER"/"FOOD"/"IRON",percent:?}
    var num = ret.num;

    var nums = {};
    var mainLv = 0;//官邸等级
    for (var i = 0; i < buildings.length; i++) {
        var type = buildings[i].type;
        if (type == "OFFICE")
            mainLv = buildings[i].level;
        if (nums[type] == null) {
            nums[type] = 0;
        }
        nums[type]++;
        //处理获取
        if (type == types["农田"]
                || type == types["民户"]
                || type == types["牧场"]
                || type == types["商铺"]
                || type == types["炼铁厂"]) {
            //{"act":"Manor.harvestProduct","sid":"d883597992ae536fb03c339254f99cef422003e8","body":"{\"field\":4}"}
            ret = client.sendAct("Manor.harvestProduct", {field: buildings[i].field});
            if (ret.out != null && ret.out > 0) {
                client.info("[" + type + "]获取资源[" + ret.out + "]");
            }
        }
    }
    //{"act":"Manor.buildField","sid":"d883597992ae536fb03c339254f99cef422003e8","body":"{\"field\":4,\"type\":\"NT\"}"}
    //{"act":"Manor.refreshManor","sid":"d883597992ae536fb03c339254f99cef422003e8"}
    var canBuildNum = fields.length - buildings.length;
    for (var i = 0; i < canBuildNum; i++) {
        for (var j = 0; j < prior.length; j++) {
            var name = prior[j];
            var type = types[name];
            //获取指定建筑可以建的数量
            var num = num_config[mainLv][config[name][8]] - (nums[type] == null ? 0 : nums[type]);
            if (num > 0) {
                ret = client.sendAct("Manor.buildField", {field: buildings.length + i + 1, type: type});
                if (ret.building != null) {
                    if (nums[type] == null) {
                        nums[type] = 0;
                    }
                    nums[type]++;
                    client.sendAct("Manor.refreshManor");
                    client.info("建造[" + name + "]成功");
                    client.props.task_nextTime = 0;
                } else {
                    client.info(API.encodeJson(ret));
                }
            }
        }
    }
    client.info("1分钟后再次尝试");
    client.props.manor_nextTime = now + 60000;

    return true;
}