/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//{"act":"Activity.drawLoginReward","sid":"d883597992ae536fb03c339254f99cef422003e8","body":"{\"days\":1}"}
//{"act":"Activity.getLoginRewardInfo","sid":"d883597992ae536fb03c339254f99cef422003e8"}
//{curDays:?,loginDays:[1],rewardDays:[1]}
function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.loginReward_lastTime == null)
        client.props.loginReward_lastTime = 0;
    if (API.getDayDiff("00:00:00", client.props.loginReward_lastTime) <= 0) {
        return false;
    }

    client.info("-----处理登录奖励");

    client.sendAct("Activity.login");
    var ret = client.sendAct("Activity.getLoginRewardInfo");

    //client.info(API.encodeJson(ret));
    //API.sleep(100000000000000);

    for (var i = 0; i < ret.loginDays.length; i++) {
        var day = ret.loginDays[i];
        //client.info(ret.rewardDays.indexOf(day));
        if (ret.rewardDays.indexOf(day) < 0) {
            var ret1 = client.sendAct("Activity.drawLoginReward", {days: day});
            client.info("领取day[" + day + "]的登录奖励[" + API.encodeJson(ret.config[day - 1].rewards) + "]" + API.encodeJson(ret1));
        }
    }

    client.info("登录奖励处理完毕,设定隔天再次尝试");
    client.props.loginReward_lastTime = now; 

    //API.sleep(10000000000);
}

