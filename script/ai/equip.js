/* 
 * 武将装备,兵种升阶
 * 武将培养优先排序
 */
//重骑兵：关羽、吕布、吕蒙、张辽
//陷阵兵：赵云 许褚 夏侯惇 颜良 于禁
//丹阳兵 甘宁,黄盖,凌统,孟获
//重盾兵：典韦 曹仁 周泰 太史慈
//禁卫军：孙策 魏延 夏侯霸 徐晃
//游骑兵：张飞 张合 邓艾 文丑
//弩骑兵:貂蝉 小乔 吕绮玲
//西凉铁骑：马超
//长弓兵:孙尚香 荀攸 黄忠
//重弩兵:贾诩 甄姬 徐庶
var heros = {
    "重骑兵": ["关羽", "吕布", "吕蒙", "张辽"]
    , "陷阵兵": ["赵云", "许褚", "夏侯惇", "颜良", "于禁"]
    , "丹阳兵": ["甘宁", "黄盖", "凌统", "孟获"]
    , "重盾兵": ["典韦", "曹仁", "周泰", "太史慈"]
    , "禁卫军": ["孙策", "魏延", "夏侯霸", "徐晃"]
    , "游骑兵": ["张飞", "张合", "邓艾", "文丑"]
    , "弩骑兵": ["貂蝉", "小乔", "吕绮玲"]
    , "西凉铁骑": ["马超"]
    , "长弓兵": ["孙尚香", "荀攸", "黄忠"]
    , "重弩兵": ["贾诩", "甄姬", "徐庶"]
};

//WHI GRE BLU PUR GOL
var clrIndex = {
    "WHI": 1
    , "GRE": 2
    , "BLU": 3
    , "PUR": 4
    , "GOL": 5
}


function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.equip_nextTime == null)
        client.props.equip_nextTime = 0;
    if (now < client.props.equip_nextTime) {
        return false;
    }

    client.info("-----尝试装备军械、招募升星、兵种进阶、技能升级");

    var hasUp = false;

    //获取英雄列表,背包数据
    client.runAI("state", 0x08 | 0x10 | 0x01);

    //兵种装备、升级进阶
    var config = API.context.getConfig("heroGrow");
    var skillUp_config = API.context.getConfig("armySkillUp");
    var leve_config = API.context.getConfig("upLevel");//[9,500,400,7957,3466]
    var item_config = API.context.getConfig("item");//[10084,"初级经验书","经验丹（绿）","书籍是人类进步的阶梯，英雄使用后可以获得500点经验。","103","GRE","1",250,10083,"500",0,"500","12.5","2.5","5","25","5","5","","",4,20]
    var ret;
    var mainLv = Number(client.props.props["LEVEL"]);


    //英雄招募,升星
    //["关羽","关羽","M","WHI",1,"极武",1,"100015",1,"重骑兵",1,1,0,3,"可招募",3,1,77,84,95,106,114,78,89,97,110,117,58,63,72,79,87]
    var hero_config = API.context.getConfig("hero");
    //INFO - API.info:[1,10,30,10000]//星级,?,将魂需求,金币需求
    var upCost_config = API.context.getConfig("heroGetUpCost");
    for (var iname in client.props.items) {
        var start = iname.indexOf("将魂");
        if (start > 0) {
            var name = iname.substr(0, start);
            var hero = client.props.herosNameIndex[name];
            var num = client.props.items[iname].n;
            if (hero == null) {
                var star = hero_config[name][15];
                var need = star == 1 ? 10 : upCost_config[star - 2][2];
                //判定能够招募
                if (num >= need) {//判断将魂是否足够
                    ret = client.sendAct("Hero.recruitHero", {nm: name});
                    client.info("招募武将[" + name + "]:" + API.encodeJson(ret));
                    hasUp = true;
                    //成功后刷新
                    client.runAI("state", 0x08);
                    hero = client.props.herosNameIndex[name];
                }
            }
            if (hero != null) {
                //判定能否升星
                var star = hero.star;
                //{"act":"Hero.upgradeHeroStar","sid":"d883597992ae536fb03c339254f99cef422003e8","body":"{\"index\":4}"}
                if (num >= upCost_config[star - 1][2]) {//判断将魂是否足够
                    var gold = Number(client.props.props["SILVER"]);
                    var need = upCost_config[star - 1][3];
                    if (gold >= need) {//判断金币是否足够
                        ret = client.sendAct("Hero.upgradeHeroStar", {index: hero.idx});
                        client.props.props["SILVER"] = (gold - need) + "";
                        client.info("英雄[" + hero.nm + "],升星到[" + (star + 1) + "]");
                        hasUp = true;
                    } else {
                        client.info("英雄[" + hero.nm + "],可以升星但金币不足[" + gold + "/" + need + "]");
                    }
                }
            }
            //client.info();
        }
    }
    if (hasUp)
        client.runAI("state", 0x08);

    for (var army in heros) {
        var armys = heros[army];
        for (var i = 0; i < armys.length; i++) {
            var hero = client.props.herosNameIndex[armys[i]];
            if (hero != null) {
                var cLv = clrIndex[hero.clr];//兵种颜色
                var phs = hero.phs;//颜色 +?
                var ninfo = config[hero.army][cLv][phs];
                //提升武将等级
                var canLv = mainLv < 20 ? 20 : mainLv;
                if (hero.lv < canLv) {
                    var exp_last = -hero.exp;
                    for (var lv = hero.lv; lv < canLv; lv++) {
                        exp_last += leve_config[lv - 1][2];
                    }
                    client.info(hero.nm + "等级到[" + canLv + "],需要经验:" + exp_last);
                    for (var iname in client.props.items) {
                        var start = iname.indexOf("经验丹");
                        if (start == 0) {
                            //是一颗经验丹
                            var item = client.props.items[iname];
                            while (item.n > 0) {
                                //client.info(exp_last + "/" + item_config[iname][9]);
                                ret = client.sendAct("Bag.useItem", {num: 1, index: item.idx, paramList: [hero.idx]});
                                item.n -= 1;
                                exp_last -= Number(item_config[iname][9]);
                                //client.info(exp_last + "/" + item_config[iname][9]);
                                client.info("对英雄[" + hero.nm + "]使用[" + iname + "]:" + API.encodeJson(ret));
                                //API.sleep(1000000000000000);
                                if (exp_last <= 0)
                                    break;
                            }
                            if (item.n == 0) {//如果数量为0则需要刷新一次背包数据
                                client.runAI("state", 0x10);
                                break;
                            }
                            if (exp_last <= 0) {
                                hasUp = true;
                                break;
                            }
                        }
                    }
                }
                //client.info("英雄[" + hero.nm + "]," + ninfo[13] + "," + ninfo[14] + "," + ninfo[15] + "," + ninfo[16]);
                var canUp = true;
                //处理装备
                for (var pos = 1; pos < 5; pos++) {
                    if (hero.armm[pos - 1] == 0) {
                        //判定物品是否足够
                        var need = ninfo[12 + pos].split("=");
                        if (client.props.items[need[0]] != null &&
                                client.props.items[need[0]].n >= Number(need[1])//数量足够
                                && hero.lv >= ninfo[8 + pos]) {//等级足够
                            //发送数据
                            ret = client.sendAct("Hero.fillHeroArmament", {index: hero.idx, pos: pos});
                            //client.info(API.encodeJson(ret));
                            //物品数量减少
                            client.props.items[need[0]].n -= Number(need[1]);
                            client.info("英雄[" + hero.nm + "],装备军械[" + need[0] + "][" + need[1] + "]");
                            hasUp = true;
                        } else {
                            if (client.props.items[need[0]] != null
                                    && client.props.items[need[0]].n < Number(need[1])) {
                                //记录需求
                                if (client.props.equip_needs == null) {
                                    client.props.equip_needs = [];
                                }
                                var last = Number(need[1]) - client.props.items[need[0]].n;
                                client.props.equip_needs.push([need[0], last]);
                                client.info("需要军械[" + need[0] + "x" + last + "]进行升级");
                            }
                            canUp = false;
                        }
                    }
                }
                //处理兵种进阶
                if (canUp) {
                    var gold = Number(client.props.props["SILVER"]);
                    if (gold >= ninfo[2]) {//金币足够进阶兵种
                        //{"act":"Hero.upgradeHeroColor","sid":"634671b583294ce0f1dc8ca689753ddda25af72c","body":"{\"index\":1}"}
                        ret = client.sendAct("Hero.upgradeHeroColor", {index: hero.idx});
                        client.props.props["SILVER"] = (gold - ninfo[2]) + "";
                        client.info("英雄[" + hero.nm + "],兵种进阶");
                        hasUp = true;
                    }
                }
                //处理兵种特性,升级
                //{"act":"Hero.upgradeArmyFeature","sid":"634671b583294ce0f1dc8ca689753ddda25af72c","body":"{\"heroIdx\":1,\"featureIdx\":1}"}
                for (var featureIdx = 1; featureIdx < cLv; featureIdx++) {
                    var nowLv = hero.amftLvs[featureIdx - 1];
                    var gold = Number(client.props.props["SILVER"]);
                    //client.info("处理:" + hero.nm);
                    for (var tarLv = nowLv + 1; tarLv <= hero.lv; tarLv++) {
                        if (gold >= skillUp_config[tarLv - 1][2]) {
                            ret = client.sendAct("Hero.upgradeArmyFeature", {heroIdx: hero.idx, featureIdx: featureIdx});
                            client.info("英雄[" + hero.nm + "],技能[" + featureIdx + "]提升:" + API.encodeJson(ret));
                            gold -= skillUp_config[tarLv - 1][2];
                            hasUp = true;
                        }
                    }
                    client.props.props["SILVER"] = gold + "";
                }
            }
        }
    }

    if (hasUp) {
        client.props.opencity_nextTime = 0;//如果有提升则马上关闭开启城市的等待
        client.props.task_nextTime = 0;
    }


    client.info("1分钟后再次尝试装备道具");
    client.props.equip_nextTime = now + 60000;
    //{"act":"Hero.fillHeroArmament","sid":"d883597992ae536fb03c3392ef1c220026947d86","body":"{\"index\":2,\"pos\":1}"}

    return hasUp;
}
