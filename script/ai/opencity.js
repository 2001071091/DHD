/* 
 * 开启城池战斗
 */

function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.opencity_nextTime == null)
        client.props.opencity_nextTime = 0;
    if (now < client.props.opencity_nextTime) {
        return false;
    }


    client.info("-----处理主线城市开启");

    //获取opencity信息
    client.runAI("state", 0x02 | 0x08);


    var config = API.context.getConfig("openCityConfig");
    var cities = API.context.getConfig("city");

    var times = 0;
    var lastCityName = null;
    var tarCityId = null;
    //var level = 0;
    var index = 0;
    for (var i = 0; i < config.length; i++) {
        var name = config[i][2];
        if (lastCityName != name) {
            times = 0;
            lastCityName = name;
        }
        times++;
        var lv = times;
        var id = cities[name].id;
        //client.info(name + "," + id + "," + lv);
        if (client.props.cities[id] == null) {
            tarCityId = id;
            //level = 1;
            index = i;
            break;
        } else {
            if (lv > client.props.cities[id]) {
                tarCityId = id;
                //level = lv;
                index = i;
                break;
            }
        }
    }

    //lastCityName = null;
    times--;
    for (var i = index; i < config.length; i++) {
        var name = config[i][2];
        if (lastCityName != name) {
            times = 0;
            lastCityName = name;
        }
        times++;
        var lv = times;
        var id = cities[name].id;

        client.info("挑战[" + name + "],等级[" + lv + "]");
        if (!deal(client, id, lv)) {
            break;
        }
    }

    //处理一小时后重试
    client.info("设定1小时后重新尝试挑战主线");
    client.props.opencity_nextTime = now + 3600000
}

function deal(client, cityId, level) {
    //前往
    if (!client.runAI("move", cityId)) {
        client.info("前往城市[" + cityId + "]失败");
        return false;
    }

    //发起攻击
    //{"act":"World.doAttackCity","sid":"634671b583294ce0f1dc8ca678b54efc538ca640","body":"{\"cityId\":50,\"level\":1}"}
    var result = client.sendAct("World.doAttackCity", {cityId: cityId, level: level});
    if (result.style == "ERROR") {
        client.info(API.encodeJson(result));
        return false;
    }

    //战役编号
    var campaignId = result.cid;

    //获取战役胜利帮助
    result = client.sendAct("Campaign.warReportStrategy", {campaignId: campaignId});
    var infos = result.weakest;
    var rid = 0;
    var pipei = 0;//最大匹配值
    for (var i = 0; i < infos.length; i++) {
        var heros = infos[i].heros;
        var mpp = 0;
        for (var j = 0; j < heros.length; j++) {
            if (client.props.herosNameIndex[heros[j].nm] != null) {
                mpp++;
            }
        }
        if (mpp > pipei) {
            pipei = mpp;
            rid = infos[i].id;
        }
    }

    var ret;
    if (rid == 0) {
        client.info("没有找到能够匹配的录像");
        //开始战斗
        ret = client.runAI("attack");
    } else {
        var formations = [];//录像中的阵型信息
        result = client.sendAct("Campaign.battleReplay", {id: rid});
        for (var i = 0; i < result.replays.length; i++) {
            var lheros = result.replays[i].lheros;
            var formation = {};
            formation.chief = -1;
            formation.heros = [];
            for (var i = 0; i < lheros.length; i++) {
                var info = {
                    x: lheros[i].x, y: lheros[i].y
                    , index: getHeroIndexByReplayHero(client, lheros[i])
                }
                formation.heros.push(info);
                if (lheros[i].mor > 0) {
                    formation.chief = info.index;
                }
            }
            formations.push(formation);
        }
        client.info("获取到相似度为[" + pipei + "]的录像");
        if (pipei <= 4) {
            ret = client.runAI("attack");
        } else {
            ret = client.runAI("attack", formations);
        }
    }
    if (ret) {//如果战斗成功
        client.props.task_nextTime = 0;//立即清除任务提交等待
        client.props.market_nextTime = 0;//立即清除资源领取等待
        client.props.equip_nextTime = 0;//立即取消升级等待
    }
    return ret;
    //API.sleep(10000000000);
    //获取之前的阵型,这里AI不处理之前的阵型
    //{"act":"Campaign.getAttFormation","sid":"634671b583294ce0f1dc8ca678b54efc538ca640","body":"{\"march\":\"OPEN_CITY\"}"}
}


function getHeroIndexByReplayHero(client, hero) {
    if (client.props.herosNameIndex[hero.nm] != null)
        return client.props.herosNameIndex[hero.nm].idx;
    if (client.props.herosArmyIndex[hero.army] != null) {
        return client.props.herosArmyIndex[hero.army][0].idx;
    }
    for (var i = 0; i < client.props.heros.length; i++) {
        return client.props.heros[i];
    }
}

