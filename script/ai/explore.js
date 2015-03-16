/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function loop(client, args) {
    var now = API.now();

    //处理冷却延迟
    if (client.props.explore_nextTime == null)
        client.props.explore_nextTime = 0;
    if (now < client.props.explore_nextTime) {
        return false;
    }
    client.info("-----尝试探索地图");

    var ret = client.sendAct("World.getExploredWorldArea");
    var config = API.context.getConfig("worldexplore");
    var idx = ret.idx;
    var food = Number(client.props.props["FOOD"]);
    var lv = Number(client.props.props["LEVEL"]);
    while (true) {
        var need = config[idx];
        if (food >= need[1] && lv >= need[2]) {
            //{"act":"World.exploreWorldArea","sid":"d883597992ae536fb03c33922c0b06dd3afd2938"}
            ret = client.sendAct("World.exploreWorldArea");
            if (ret.idx != null && ret.idx > idx) {
                idx = ret.idx;
                food -= need[1];
                client.props.props["FOOD"] = food + "";
                client.info("成功探索区域[" + idx + "]");
            } else {
                client.info(API.encodeJson(ret));
                break;
            }
        } else
            break;
    }

    client.props.explore_nextTime = now + 3600000;
}

