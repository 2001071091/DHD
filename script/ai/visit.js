/* 
 * 访问英雄脚本
 */


function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.visit_lastTime == null)
        client.props.visit_lastTime = 0;
    if (API.getDayDiff("00:00:00", client.props.visit_lastTime) <= 0) {
        return false;
    }

    client.info("-----访问英雄");

    var ret = client.sendAct("Hero.getVisitHeroInfoList");
    var infos = ret.infoList;
    for (var i = 0; i < infos.length; i++) {
        /**
         * info
         * {
         *      heroLevel
         *      currentTimes
         *      heroPower
         *      matchTimes
         *      buyTimes
         *      cityId
         *      toast
         * }
         */
    }



    client.info("英雄访问完毕,设定隔天再次访问");
    client.props.visit_lastTime = now;

    return true;
}


