/* 
 * 战斗脚本,匹配合适的阵型
 */
var forwardsLocs = [
    {x: -2, y: 0}, {x: -3, y: 1}, {x: -3, y: -1}
]
var backwardsLocs = [
    {x: -4, y: 0}, {x: -5, y: 1}, {x: -5, y: -1}, {x: -6, y: 0}
]
function getHero(client, types, set) {
    for (var i = 0; i < types.length; i++) {
        var type = types[i];
        var heros = client.props.herosArmyIndex[type];
        if (heros == null)
            continue;
        for (var j = 0; j < heros.length; j++) {
            var hero = heros[j];
            if (set[hero.idx] != null)
                continue;
            return hero;
        }
    }
    for (var i = 0; i < client.props.heros.length; i++) {
        var hero = client.props.heros[i];
        if (set[hero.idx] != null)
            continue;
        return hero;
    }
    return null;
}

function loop(client, args) {
    client.info("开始战斗");
    var formations = null;
    if (args.length > 1) {//判定是否有传递阵型信息
        formations = args[1];
    }

    //获取英雄列表
    client.runAI("state", 0x08);

    //获取兵种配置
    var config = API.context.getConfig("armyCategory");

    var ret;
    var round = 0;
    while (true) {
        //获取下一波敌人信息
        ret = client.sendAct("Campaign.nextEnemies");
        var enemies = ret.enemies;
        if (enemies == null) {
            client.info("战斗完毕");
            break;
        }
        var formation;
        if (formations == null || formations[round] == null) {
            client.info("计算阵型");
            formation = {};
            formation.chief = -1;
            formation.heros = [];
            //分析敌人实力和阵型
            var efor = {};
            var maxLv = 0;
            var enemyNum = 0;
            var remoteNum = 0;
            var horseNum = 0;
            var heavyNum = 0;
            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                if (efor[enemy.y] == null) {
                    efor[enemy.y] = {};
                }
                efor[enemy.y][enemy.x] = enemy;
                if (enemy.lv > maxLv) {
                    maxLv = enemy.lv;
                }
                enemyNum++;
                var cfg = config[enemy.army];
                if (cfg != null) {
                    if (cfg.remote)
                        remoteNum++;
                    if (cfg.horse)
                        horseNum++;
                    if (cfg.heavy)
                        heavyNum++;
                }
            }
            var indexSet = {};
            if (client.props.hero_maxLv - 10 > maxLv) {
                //等级相差特别大的直接使用一个英雄迎战
                var hero = getHero(client, ["重盾兵", "重骑兵", "陷阵兵"], indexSet);
                indexSet[hero.idx] = {x: -2, y: 0, index: hero.idx};
            } else if (client.props.hero_maxLv + 10 > maxLv) {
                var maxpowerIndex = -1;
                var maxpower = 0;
                var hero;
                var more = client.props.hero_maxLv + 5 > maxLv;
                //设定前锋
                if (remoteNum < enemyNum / 3) {
                    hero = getHero(client, ["重骑兵", "重盾兵", "陷阵兵"], indexSet);
                } else {
                    hero = getHero(client, ["重盾兵", "重骑兵", "陷阵兵"], indexSet);
                }
                //client.info(API.encodeJson(hero));
                if (hero.power > maxpower) {
                    maxpower = hero.power;
                    maxpowerIndex = hero.idx;
                }
                //client.info(hero.nm);
                indexSet[hero.idx] = {x: forwardsLocs[0].x, y: forwardsLocs[0].y, index: hero.idx};
                //设定两翼
                if (enemyNum > 3 && more) {
                    //设定前锋
                    if (horseNum < enemyNum / 3) {
                        hero = getHero(client, ["禁卫军", "陷阵兵", "丹阳兵"], indexSet);
                    } else {
                        hero = getHero(client, ["陷阵兵", "禁卫军", "丹阳兵"], indexSet);
                    }
                    if (hero.power > maxpower) {
                        maxpower = hero.power;
                        maxpowerIndex = hero.idx;
                    }
                    //client.info(hero.nm);
                    indexSet[hero.idx] = {x: forwardsLocs[1].x, y: forwardsLocs[1].y, index: hero.idx};
                }
                //设定远程
                var rNum = 2;
                if (enemyNum >= 4) {
                    rNum = 3;
                }
                while (--rNum >= 0) {
                    //设定远程部队
                    if (horseNum < enemyNum / 3) {
                        hero = getHero(client, ["长弓兵", "重弩兵", "弩骑兵"], indexSet);
                    } else {
                        if (heavyNum < enemyNum / 2) {
                            hero = getHero(client, ["弩骑兵", "重弩兵", "长弓兵"], indexSet);
                        } else {
                            hero = getHero(client, ["重弩兵", "弩骑兵", "长弓兵"], indexSet);
                        }
                    }
                    if (hero == null)
                        break;
                    //client.info(API.encodeJson(hero));
                    if (hero.power > maxpower) {
                        maxpower = hero.power;
                        maxpowerIndex = hero.idx;
                    }
                    //client.info(hero.nm);
                    indexSet[hero.idx] = {x: backwardsLocs[rNum].x, y: backwardsLocs[rNum].y, index: hero.idx};
                }
                formation.chief = maxpowerIndex;
                //client.info(API.encodeJson(indexSet));
            } else {
                //等级相差太大直接放弃
                client.info("等级相差太大,直接放弃" + client.props.hero_maxLv + "/" + maxLv);
                return false;
            }

            for (var key in indexSet) {
                var info = indexSet[key];
                formation.heros.push({x: info.x, y: info.y, index: info.index});
            }
        } else {
            client.info("使用现有阵型");
            formation = formations[round];
        }

        ret = client.sendAct("Campaign.saveFormation", formation);
        //API.sleep(1000000000000000);

        ret = client.sendAct("Campaign.fightNext");
        if (ret.ok != 1) {
            client.info("Campaign.fightNext 返回异常:" + API.encodeJson(ret));
            return false;
        }

        //从sock截获战斗数据
        client.info("等待战斗结果...");
        var wait_start = API.now();
        var sret;
        while (true) {
            if (API.now() - wait_start >= 5000) {
                client.info("等待结果超时");
                break;
            }
            sret = client.getSockJson();
            if (sret != null && sret.status != null && sret.status.state != null) {
                client.info("战斗结果:[" + sret.status.state + "][" + sret.status.lastResult + "]");
                if (sret.status.state == "FAIL") {
                    return false;//挑战失败
                }
                break;
            }
            //API.encodeJson(sret)
            API.sleep(125);
        }
        round++;
    }

    //client.info(client.props.props["FOOD"]+"/"+food);

    return true;//挑战成功
}

