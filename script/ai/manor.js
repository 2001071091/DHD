/* 
 * 封地
 */
var types = {
    "官邸": "OFFICE"//
    , "粮仓": "LC"//
    , "银库": "YK"//
    , "农田": "NT"//
    , "民户": "MH"//
    , "校场": "JC"//
    , "牧场": "MC"//
    , "商铺": "SP"
    , "工匠坊": "GJF"//
    , "精铁库": "JTK"//
    , "炼铁厂": "LTC"//
};

var upInfoTables = {
    OFFICE: "officialUpInfo"
    , LC: "barnUpInfo"
    , YK: "cashboxUpInfo"
    , NT: "farmlandUpInfo"
    , MH: "houseUpInfo"
    , JC: "campUpInfo"
    , MC: "ranchUpInfo"
    , SP: "shopUpInfo"
    , GJF: "factoryUpInfo"
    , JTK: "ironDepotUpInfo"
    , LTC: "ironfactoryUpInfo"
}

//建造优先级,优先升级
var prior = ["牧场"
            , "商铺"
            , "农田"
            , "民户"
            , "炼铁厂"
            , "工匠坊"
            , "校场"
            , "精铁库"];

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
    var floorCost_config = API.context.getConfig("floorCostInfo");//开垦消耗

    var ret;
    //{"act":"Manor.getManorInfo","sid":"d883597992ae536fb03c339254f99cef422003e8"}
    //"incpercent":[{"resource":"FOOD","percent":0},{"resource":"SILVER","percent":0}],"buildings":[{"levelSeconds":0,"field":1,"heroIndex":0,"level":1,"type":"OFFICE","produceSeconds":0,"leftSeconds":0,"products":0},{"levelSeconds":0,"field":2,"heroIndex":0,"level":1,"type":"LC","produceSeconds":0,"leftSeconds":0,"products":0},{"levelSeconds":0,"field":3,"heroIndex":0,"level":1,"type":"YK","produceSeconds":0,"leftSeconds":0,"products":0},{"levelSeconds":0,"field":4,"heroIndex":0,"level":1,"type":"NT","produceSeconds":0,"leftSeconds":0,"products":19728},{"levelSeconds":0,"field":5,"heroIndex":0,"level":1,"type":"MH","produceSeconds":0,"leftSeconds":0,"products":9792},{"levelSeconds":0,"field":6,"heroIndex":0,"level":1,"type":"NT","produceSeconds":0,"leftSeconds":0,"products":19728}],"num":2,"fields":[1,2,3,4,5,6,7]}
    ret = client.sendAct("Manor.getManorInfo");
    //client.info(API.encodeJson(ret));
    //API.sleep(1000000000000000);
    var fields = ret.fields;
    var buildings = ret.buildings;//{field:?,type:"OFFICE"/"LC"/"YK/"NT"/"MH",leve:?,levelSeconds:?,heroIndex:?,leftSeconds:?,products:?,produceSeconds:?}
    var incpercent = ret.incpercent;//{resource:"SILVER"/"FOOD"/"IRON",percent:?}
    var num = ret.num;//建筑队列数量

    //处理开垦
    var playerLv = Number(client.props.props["LEVEL"]);
    var gold = Number(client.props.props["SILVER"]);
    for (var i = 0; i < floorCost_config.length; i++) {
        var field = 7 + i;
        if (fields.indexOf(field) >= 0)//已经开垦继续
            continue;
        if (playerLv < floorCost_config[i][1])//等级不足跳出
            break;
        if (gold < floorCost_config[i][2])//钱不足跳出
            break;
        //{"act":"Manor.openField","sid":"d883597992ae536fb03c3392e1b9efae0b647c85","body":"{\"field\":7}"}
        client.sendAct("Manor.openField", {field: field});
        client.info("开垦第[" + field + "]块地");
        fields[field - 1] = field;
        gold -= floorCost_config[i][2];
        client.props.props["SILVER"] = gold + "";
    }

    //处理官邸升级
    var officialUpInfo = API.context.getConfig("officialUpInfo");
    var mainLv = buildings[0].level;
    if (hasQueue(client, num, now)
            && mainLv < 20//不是最高级
            && buildings[0].levelSeconds == 0//没有在升级
            && playerLv >= officialUpInfo[mainLv][1]//主公等级足够
            && gold >= officialUpInfo[mainLv][2]) {//金钱足够
        //{"act":"Manor.upgradeBuilding","sid":"d883597992ae536fb03c3392e1b9efae0b647c85","body":"{\"field\":1}"}
        //{"building":{"field":1,"type":"OFFICE","level":1,"levelSeconds":61,"heroIndex":0,"leftSeconds":0,"products":0,"produceSeconds":0}}
        client.sendAct("Manor.upgradeBuilding", {field: 1});
        mainLv++;
        doQueue(client, num, now, officialUpInfo[mainLv][4]);
        client.info("开始官邸Lv" + mainLv + "升级,时间" + officialUpInfo[mainLv][4] + "秒");
        gold -= officialUpInfo[mainLv][2];
        client.props.props["SILVER"] = gold + "";
    }

    //统计建筑数量,并收获资源
    var nums = {};
    var building_index = {};
    for (var i = 0; i < buildings.length; i++) {
        var type = buildings[i].type;
        building_index[buildings[i].field] = buildings[i];
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

    //建造建筑
    var buildSomething = false;
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (building_index[field] != null)
            continue;
        if (!hasQueue(client, num, now))
            break;
        for (var j = 0; j < prior.length; j++) {
            var name = prior[j];
            var type = types[name];
            //{"act":"Manor.buildField","sid":"d883597992ae536fb03c339254f99cef422003e8","body":"{\"field\":4,\"type\":\"NT\"}"}
            //{"act":"Manor.refreshManor","sid":"d883597992ae536fb03c339254f99cef422003e8"}
            //获取指定建筑可以建的数量
            var _num = num_config[mainLv][config[name][8]] - (nums[type] == null ? 0 : nums[type]);
            if (_num > 0) {
                ret = client.sendAct("Manor.buildField", {field: field, type: type});
                if (ret.building != null) {
                    if (nums[type] == null) {
                        nums[type] = 0;
                    }
                    nums[type]++;
                    client.sendAct("Manor.refreshManor");
                    client.info("建造[" + name + "]成功");
                    client.props.task_nextTime = 0;
                    buildSomething = true;
                    doQueue(client, num, now, 1);
                    break;
                } else {
                    client.info(API.encodeJson(ret));
                }
            }
        }
    }

    if (buildSomething) {
        //如果有建筑建造则刷新下信息
        ret = client.sendAct("Manor.getManorInfo");
        fields = ret.fields;
        buildings = ret.buildings;
        incpercent = ret.incpercent;
        num = ret.num;
    }

    //处理建筑升级
    for (var j = 0; j < prior.length; j++) {
        var type = types[prior[j]];
        for (var i = 0; i < buildings.length; i++) {
            if (type != buildings[i].type)
                continue;
            tryBuildUpgrade(client, num, now, buildings[i], mainLv);
        }
    }


    client.info("1分钟后再次尝试");
    client.props.manor_nextTime = now + 60000;

    return true;
}

function doQueue(client, num, now, time) {
    for (var i = 0; i < num; i++) {
        var key = "manor_build_" + i + "_next";
        var next = client.getObject(key);
        if (next == null || next < now) {
            //client.info(now + (time + 1) * 1000)
            client.setObject(key, now + (time + 1) * 1000);
            return;
        }
    }
}

function hasQueue(client, num, now) {
    for (var i = 0; i < num; i++) {
        var next = client.getObject("manor_build_" + i + "_next");
        //client.info(next + "/" + now);
        if (next == null || next < now) {
            return true;
        }
    }
    return false;
}

function tryBuildUpgrade(client, num, now, build, mainLv) {
    //client.info(API.encodeJson(build));
    //client.info(build.field + "," + build.type +"," + num);
    if (hasQueue(client, num, now)
            && build.level < 20//不是最高级
            && build.levelSeconds == 0) {//没有在升级
        var gold = Number(client.props.props["SILVER"]);
        if (upInfoTables[build.type] == null) {
            client.info("没有设置建筑[" + build.type + "]对应的升级消耗配置表");
            return;
        }
        var upInfo = API.context.getConfig(upInfoTables[build.type]);//    var barnUpInfo = API.context.getConfig("barnUpInfo");
        if (mainLv >= upInfo[build.level][1]
                && gold >= upInfo[build.level][2]) {
            //{"act":"Manor.upgradeBuilding","sid":"d883597992ae536fb03c3392e1b9efae0b647c85","body":"{\"field\":1}"}
            //{"building":{"field":1,"type":"OFFICE","level":1,"levelSeconds":61,"heroIndex":0,"leftSeconds":0,"products":0,"produceSeconds":0}}
            client.sendAct("Manor.upgradeBuilding", {field: build.field});
            doQueue(client, num, now, upInfo[build.level][4]);
            client.info("开始[" + build.type + "]Lv" + (build.level+1) + "升级,时间" + upInfo[build.level][4] + "秒");
            build.level++;
            build.levelSeconds = upInfo[build.level][4] + 1;
            gold -= upInfo[build.level][2];
            client.props.props["SILVER"] = gold + "";
        }
    }
}