/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loop(client, args) {
    var tarCityId = args[1];

    //获取信息
    client.runAI("state", 0x04);//获取玩家当前地图

    client.sendAct("Campaign.quitCampaign");//离开可能存在的战斗

    if (tarCityId == client.props.cityInfo.curCity) {
        client.info("已经在地图[" + tarCityId + "]");
        return true;
    }
    //尝试离开城市
    result = client.sendAct("World.goOutOfCity");
    if (result.ok == 1) {
        //client.info("离开地图[" + client.props.cityInfo.curCity + "]");
    }

    /**
     * 网格寻路
     */
    var list = API.context.paths.find(client.props.cityInfo.curCity, tarCityId);
    var path = [];
    path.push(client.props.cityInfo.curCity);
    for (var i = 0; i < list.size(); i++) {
        path.push(list.get(i));
    }

    //前往
    var result = client.sendAct("World.go", {path: path});
    client.info("前往地图[" + tarCityId + "]");
    return true;
}