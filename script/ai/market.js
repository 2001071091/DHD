/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.market_nextTime == null)
        client.props.market_nextTime = 0;
    if (now < client.props.market_nextTime) {
        return false;
    }

    client.info("-----获取免费市场资源");

    var ret;
    ret = client.sendAct("Shop.getResourceTradeInfo");
    var silver = ret.freeSilver;
    var food = ret.freeFood;
    for (var i = 0; i < silver; i++) {
        ret = client.sendAct("Shop.tradeResource", {resouce: "SILVER"});
        client.info("获得银两:[" + ret.got + "]");
    }
    for (var i = 0; i < food; i++) {
        ret = client.sendAct("Shop.tradeResource", {resouce: "FOOD"});
        client.info("获得粮草:[" + ret.got + "]");
    }

    client.info("1小时后再次尝试领取免费资源");
    client.props.market_nextTime = now + 3600000;

    return true;
}

