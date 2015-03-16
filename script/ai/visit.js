/* 
 * 访问英雄脚本
 */


function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.visit_lastTime == null)
        client.props.visit_lastTime = 0;
    if (API.getDayDiff("00:00:00", client.props.visit_lastTime) <= 0) {
        return false;
    }

    client.info("-----访问英雄");

    var ret = client.sendAct("Hero.getVisitHeroInfoList");
    var infos = ret.infoList;
    for (var i = 0; i < infos.length; i++) {
        /**
         * info
         * {
         *      heroLevel
         *      currentTimes
         *      heroPower
         *      matchTimes
         *      buyTimes
         *      cityId
         *      toast
         * }
         */
        //{"act":"Hero.matchHero","sid":"d883597992ae536fb03c33922c0b06dd3afd2938","body":"{\"heroName\":\"徐晃\"}"}
    }



    client.info("英雄访问完毕,设定隔天再次访问");
    client.props.visit_lastTime = now;

    return true;
}

function deal(client, heroName) {
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


