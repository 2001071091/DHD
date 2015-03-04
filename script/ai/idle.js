/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//创建昵称
//{"act":"Player.createNcikname","sid":"634671b583294ce0f1dc8ca689753ddda25af72c","body":"{\"nickname\":\"荆州上官正南\"}"}

function loop(client, args) {
    //获取等级,判定自己能够干的事情
    client.runAI("state", 0x01);
    var lv = Number(client.props.props["LEVEL"]);

    //修正服务器和客户端时间差异
    var now = API.now();
    var result = client.sendAct("System.ping", {clientTime: now});
    client.props.timeoffset = Number(result.serverTime) - Number(result.clientTime);
    client.runAI("campaign");
    //处理引导
    client.runAI("guide");
    //获取英雄
    client.runAI("getHero");
    //获取邮件
    client.runAI("mail");
    //英雄进行装备
    client.runAI("equip");
    //封地
    if (lv >= 10)
        client.runAI("manor");
    //处理任务提交
    client.runAI("task");

    //领取登录奖励
    client.runAI("loginReward");

    //开启城市
    client.runAI("opencity");
    //10级开始市集免费领钱
    if (lv >= 10)
        client.runAI("market");
    //民生
    if (lv >= 30)
        client.runAI("patrol");
    //皇榜

    API.sleep(3000);
    return false;//空间脚本只能返回false
}