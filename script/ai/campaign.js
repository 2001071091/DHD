/* 
 *  讨伐群雄
 *  天下比武
 */
var _gotStarNumRwds = [5, 10, 15];

function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.campaign_nextTime == null)
        client.props.campaign_nextTime = 0;
    if (now < client.props.campaign_nextTime) {
        return false;
    }

    client.info("-----尝试处理 讨伐群雄");
    var ret = client.sendAct("Campaign.eliteGetAllInfos");
    //client.info(API.encodeJson(ret));
    //API.sleep(100000000);
    var lv = 0;
    if (ret.data.length > 0) {
        var data = ret.data;
        lv = data.length * 5 - (5 - data[data.length - 1].stages.length);
        //处理奖励领取
        for (var i = 0; i < data.length; i++) {
            var chapterStart = 0;
            var chapter = data[i].chapter;
            var stages = data[i].stages;
            var difficult = data[i].difficult;
            var gotStarNumRwds = data[i].gotStarNumRwds;
            for (var j = 0; j < stages.length; j++) {
                //{"act":"Campaign.eliteGetFullStarReward","sid":"d883597992ae536fb03c3392e1b9efae0b647c85","body":"{\"difficult\":\"普通\",\"chapter\":2,\"stage\":1}"}
                if (stages[j].star == 3 && stages[j].rwd == false) {
                    client.sendAct("Campaign.eliteGetFullStarReward", {difficult: difficult, chapter: chapter, stage: j + 1});
                    client.info("讨伐群雄 [" + difficult + "][" + chapter + "][" + (j + 1) + "]领取3星奖励");
                }
                chapterStart += stages[j].star;
            }
            for (var j = 0; j < _gotStarNumRwds.length; j++) {
                if (chapterStart >= _gotStarNumRwds[j] && gotStarNumRwds.indexOf((j + 1)) < 0) {
                    //{"act":"Campaign.eliteGetStarNumReward","sid":"d883597992ae536fb03c3392e1b9efae0b647c85","body":"{\"chapter\":1,\"level\":2}"}
                    client.sendAct("Campaign.eliteGetStarNumReward", {chapter: chapter, level: j + 1});
                    client.info("讨伐群雄 [" + difficult + "][" + chapter + "]领取" + _gotStarNumRwds[j] + "星奖励");
                }
            }
        }
    }

    client.runAI("state", 0x08);

    client.sendAct("Campaign.quitCampaign");//离开可能存在的战斗
    while (deal(client, lv)) {
        client.info("讨伐群雄[" + lv + "]成功,继续尝试");
        lv++;
    }

    ret = client.sendAct("Campaign.getLeftTimes");

    //{"act":"Campaign.eliteGetAllInfos","sid":"d883597992ae536fb03c3392eea62a85493b269e"}
    //尝试挑战未通关的 讨伐群雄

    var config = API.context.getConfig("eliteFBRandomReward");
    //client.info(API.encodeJson(config));

    lv--;
    client.info("讨伐群雄剩余次数[" + ret.elite + "]");
    //挑战已经通关单 讨伐群雄 获得奖励[首先尝试最需要的军械装备]
    while (ret.elite > 0) {//如果 讨伐群雄 次数大于0
        var index = lv;
        //记录需求
        if (client.props.equip_needs != null) {
            for (var i = 0; i < client.props.equip_needs.length; i++) {
                var item = client.props.equip_needs[i][0];
                var need = client.props.equip_needs[i][1];
                if ((config[item][0] - 1) <= lv) {
                    index = config[item][0] - 1;
                    client.info("需求[" + item + "x" + need + "],挑战Lv" + (index + 1) + "的讨伐群雄");
                    break;
                }
            }
        }
        if (!deal(client, index)) {
            client.info("挑战失败,放弃");
            break;
        }
        ret.elite--;
    }



    //{"act":"Arena.getDefFormation","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
    //{"heros":[{"index":5,"x":-2,"y":0},{"index":6,"x":-4,"y":0},{"index":4,"x":-5,"y":1}],"power":3701,"costFd":0,"chief":5}

    //{"act":"Arena.myArenaStatus","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
    //{"rank":10000,"highest":10000,"rwdRank":0,"coin":0,"leftTimes":5,"resetTimes":0,"cd":0}

    //{"act":"Arena.changeEnemies","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
    //{"list":[{"nm":"脆弱的赵仲宣","icn":100052,"lv":17,"pwr":2136,"rnk":5667,"winc":0,"heros":[{"nm":"夏侯惇","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":103,"morp":0},{"nm":"甄姬","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":104,"morp":0},{"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":95,"morp":0},{"nm":"夏侯霸","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":95,"morp":0},{"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":105,"morp":0}]},{"nm":"忠诚的何孟博","icn":100022,"lv":16,"pwr":1907,"rnk":7805,"winc":0,"heros":[{"nm":"贾诩","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":96,"morp":0},{"nm":"曹仁","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":104,"morp":0},{"nm":"孙尚香","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":102,"morp":0},{"nm":"于禁","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":101,"morp":0},{"nm":"甄姬","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":95,"morp":0}]},{"nm":"京兆穆安国","icn":100050,"lv":15,"pwr":1805,"rnk":8804,"winc":0,"heros":[{"nm":"文丑","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":97,"morp":0},{"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":96,"morp":0},{"nm":"曹仁","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":103,"morp":0},{"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":104,"morp":0},{"nm":"贾诩","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":101,"morp":0}]},{"nm":"黄河韩公悌","icn":100047,"lv":15,"pwr":1833,"rnk":9753,"winc":0,"heros":[{"nm":"孙尚香","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":101,"morp":0},{"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":95,"morp":0},{"nm":"黄盖","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":102,"morp":0},{"nm":"夏侯霸","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":98,"morp":0},{"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":99,"morp":0}]}],"_type":"SCChangeEnemies","_rs":1}


    //var eliteTimes = ret.elite;
    //var arenaTimes = ret.arena;

    //处理一小时后重试
    client.info("设定1小时后重新尝试讨伐群雄");
    client.props.campaign_nextTime = now + 3600000
}



function deal(client, lv) {
    var chapter = Math.floor(lv / 5) + 1;
    var stage = lv % 5 + 1;
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
