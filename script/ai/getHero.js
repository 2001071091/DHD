/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.getHero_nextTime == null)
        client.props.getHero_nextTime = 0;
    if (now < client.props.getHero_nextTime) {
        return false;
    }

    client.info("-----尝试获取免费英雄");

    //{"act":"Hero.feastHero","sid":"d883597992ae536fb03c3392c8ddec3809f3b84f","body":"{\"type\":\"COMMON_FIVE\",\"free\":true}"}
    /**
     * {discount:?,heroes:[{reward:{resource:"?",num:?},hero:"?",changeFrag:false}]}  
     */
    //{"act":"Hero.feastHero","sid":"634671b583294ce0f1dc8ca689753ddda25af72c","body":"{\"free\":true,\"type\":\"GOLD_ONE\"}"}
    /**
     * {discount:?,heroes:[{reward:{resource:"?",num:?},hero:"?",changeFrag:false}]}  
     */

    var ret;
    //{"act":"Shop.shopNextRefreshTime","sid":"634671b583294ce0f1dc8ca689753ddda25af72c"}
    ret = client.sendAct("Shop.shopNextRefreshTime");
    var time_common = ret.common;
    var time_gold = ret.gold;
    if (time_common <= 0 && time_gold <= 0) {
        ret = client.sendAct("Hero.feastHero", {type: "COMMON_FIVE", free: true});
        traceRet(client, ret);
        ret = client.sendAct("Hero.feastHero", {type: "GOLD_ONE", free: true});
        traceRet(client, ret);
        client.info("设置1天后再次尝试");
        client.props.getHero_nextTime = now + 86400000;
    } else {
        var nextTime = time_common > time_gold ? time_common : time_gold;
        client.info("当前时间不能免费获取英雄,需要等待[" + nextTime + "]秒");
        client.props.getHero_nextTime = now + nextTime * 1000;
    }

    return true;
}

function traceRet(client, ret) {
    for (var i = 0; i < ret.heroes.length; i++) {
        var info = ret.heroes[i];
        if (info.reward != null) {
            client.info("获得道具[" + API.encodeJson(info.reward) + "]");
        } else if (info.hero != "") {
            client.info("获得英雄[" + info.hero + "]");
        }
    }
}
