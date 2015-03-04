/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


//{"act":"Player.updateGuideSequence","sid":"634671b583294ce0f1dc8ca689753ddda25af72c","body":"{\"seq\":\"48\",\"guideType\":\"MAIN\"}"}

function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.guide_nextTime == null)
        client.props.guide_nextTime = 0;
    if (now < client.props.guide_nextTime) {
        return false;
    }


    client.info("-----尝试更新引导,当前引导位置:" + client.props.guide);
    //INFO - API.info:["46","","","蔡文姬：恩公高义，文姬铭记于心。一点{item:薄礼}，请恩公收下。",0,1,"道具=改名卡=1","黄金=50","银两=3000","","",""]
    var config = API.context.getConfig("MainGuideData");
    if (client.props.guide >= 0) {
        for (var i = 0; i < config.length; i++) {
            var info = config[i];
            if (Number(info[0]) > client.props.guide) {
                var ret = client.sendAct("Player.updateGuideSequence", {seq: info[0], guideType: "MAIN"});
                client.info(info[0] + "结果:" + API.encodeJson(ret))
            }
        }
        client.info("更新完毕");
        client.props.guide = -1;
    }

    client.info("1天后再次尝试更新引导信息");
    client.props.guide_nextTime = now + 86400000;

    return true;
}