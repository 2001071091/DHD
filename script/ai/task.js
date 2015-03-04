/* 
 * 处理任务完成
 */
function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.task_nextTime == null)
        client.props.task_nextTime = 0;
    if (now < client.props.task_nextTime) {
        return false;
    }

    //{"act":"Task.finishTask","sid":"bb777ba1bd0e7d16bddec4d5bd7e74ed0e9a1e86","body":"{\"taskId\":1}"}
    client.info("-----尝试提交已经完成的任务");

    while (true) {
        var doBreak = true;
        var ret = client.sendAct("Task.getTaskTraceInfo");
        var tasks = ret.tasks;
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            //client.info(API.encodeJson(task));
            if (task.status == "FIN") {
                ret = client.sendAct("Task.finishTask", {taskId: task.id});
                client.info("提交任务[" + task.id + "]:" + API.encodeJson(ret));
                doBreak = false;//有任务提交后还需要再尝试提交一次
                client.props.equip_nextTime = 0;
            }
        }
        if (doBreak)
            break;
    }

    client.info("1分钟后再次尝试提交任务");
    client.props.task_nextTime = now + 60000;
}