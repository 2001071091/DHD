/* 
 *  讨伐群雄
 *  天下比武
 */

function loop(client, args) {
    var ret = client.sendAct("Campaign.eliteGetAllInfos");
    client.info(API.encodeJson(ret));
    var lv = ret.data.length;

    client.runAI("state", 0x08);

    client.sendAct("Campaign.quitCampaign");//离开可能存在的战斗
    while (deal(client, lv)) {
        client.info("讨伐群雄[" + lv + "]成功,继续尝试");
        lv++;
    }

    ret = client.sendAct("Campaign.getLeftTimes");

    //{"act":"Campaign.eliteGetAllInfos","sid":"d883597992ae536fb03c3392eea62a85493b269e"}
    //尝试挑战未通关的 讨伐群雄

    var config = API.context.getConfig("eliteFBDetail2");
    client.info(API.encodeJson(config));

    //挑战已经通关单 讨伐群雄 获得奖励[首先尝试最需要的军械装备]
    while (ret.elite > 0) {//如果 讨伐群雄 次数大于0
        var index = 0;
        //记录需求
        if (client.props.equip_needs != null) {
            var need = client.props.equip_needs[0];
            index = config[need][11];
        }
        if (index > lv) {
            index = lv;
        }
        if (!deal(client, index)) {
            client.info("挑战失败,放弃");
            break;
        }
        ret.elite--;
    }
    API.sleep(10000000000000000000);
    //var eliteTimes = ret.elite;
    //var arenaTimes = ret.arena;
}



function deal(client, lv) {
    var stage = Math.floor(lv / 5) + 1;
    var chapter = lv % 5 + 1;
    //发起攻击
    //{"act":"Campaign.eliteFight","sid":"d883597992ae536fb03c3392eea62a85493b269e","body":"{\"stage\":1,\"chapter\":1,\"difficult\":\"普通\"}"}
    var result = client.sendAct("Campaign.eliteFight", {stage: stage, chapter: chapter, difficult: "普通"});
    if (result.style == "ERROR") {
        client.info("Campaign.eliteFight失败:" + API.encodeJson(result));
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
