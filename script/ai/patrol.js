/* 
 * 大皇帝处理民生脚本
 */
function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.patrol_nextTime == null)
        client.props.patrol_nextTime = 0;
    if (now < client.props.patrol_nextTime) {
        //client.info("民生需要等待" + Math.ceil((client.props.patrol_nextTime - now) / 1000) + "秒");
        return false;
    }

    client.info("-----尝试执行民生任务");

    var ret = client.sendAct("Patrol.getPatrolInfo");
    if (ret.style == "ERROR") {
        client.info(API.encodeJson(ret));
        return false;
    }

    var success = 0;
    for (var i = 0; i < ret.events.length; i++) {
        var event = ret.events[i];
        if (deal(client, event.city)) {
            success++;
            continue;
        }
        var retry = 3;
        while (!deal(client, event.city) && retry > 0) {
            retry--;
            client.info("民生任务执行失败,重试");
        }
    }

    //计算出下次出现的客户端时间
    client.props.patrol_nextTime = ret.nextTm * 1000 - client.props.timeoffset;
    if (ret.events.length == 0)
        client.info("没有民生任务,记录下次出现时间为:" + Math.ceil((client.props.patrol_nextTime - now) / 1000) + "秒后");
    else
        client.info("民生任务已经前部执行" + success + "/" + ret.events.length + ",记录下次出现时间为:" + Math.ceil((client.props.patrol_nextTime - now) / 1000) + "秒后");

    return success == ret.events.length;
}

function deal(client, cityId) {
    //前往
    if (!client.runAI("move", cityId)) {
        client.info("前往城市[" + cityId + "]失败");
        return false;
    }

    //发起攻击
    //{"act":"Patrol.dealPatroledEvent","sid":"bb777ba1bd0e7d16bddec4d5366ab3fbcdd26a3d","body":"{\"cityId\":4}"}
    var result = client.sendAct("Patrol.dealPatroledEvent", {cityId: cityId});
    if (result.style == "ERROR") {
        client.info("Patrol.dealPatroledEvent 返回错误:" + API.encodeJson(result));
        return false;
    }

    //开始战斗
    return client.runAI("attack");
}
