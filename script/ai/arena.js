

//{"act":"Arena.getDefFormation","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
//{"heros":[{"index":5,"x":-2,"y":0},{"index":6,"x":-4,"y":0},{"index":4,"x":-5,"y":1}],"power":3701,"costFd":0,"chief":5}

//{"act":"Arena.myArenaStatus","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
//{"rank":10000,"highest":10000,"rwdRank":0,"coin":0,"leftTimes":5,"resetTimes":0,"cd":0}

//{"act":"Arena.changeEnemies","sid":"d883597992ae536fb03c3392e1b9efae0b647c85"}
//{"list":[
//{"nm":"脆弱的赵仲宣","icn":100052,"lv":17,"pwr":2136,"rnk":5667,"winc":0,
//      "heros":[
//          {"nm":"夏侯惇","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":103,"morp":0},
//          {"nm":"甄姬","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":104,"morp":0},
//          {"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":95,"morp":0},
//          {"nm":"夏侯霸","clr":"WHI","phs":0,"star":1,"lv":19,"hpp":95,"morp":0},
//          {"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":105,"morp":0}]},
//{"nm":"忠诚的何孟博","icn":100022,"lv":16,"pwr":1907,"rnk":7805,"winc":0,
//      "heros":[
//          {"nm":"贾诩","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":96,"morp":0},
//          {"nm":"曹仁","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":104,"morp":0},
//          {"nm":"孙尚香","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":102,"morp":0},
//          {"nm":"于禁","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":101,"morp":0},
//          {"nm":"甄姬","clr":"WHI","phs":0,"star":1,"lv":18,"hpp":95,"morp":0}]},
//{"nm":"京兆穆安国","icn":100050,"lv":15,"pwr":1805,"rnk":8804,"winc":0,
//      "heros":[
//          {"nm":"文丑","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":97,"morp":0},
//          {"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":96,"morp":0},
//          {"nm":"曹仁","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":103,"morp":0},
//          {"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":104,"morp":0},
//          {"nm":"贾诩","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":101,"morp":0}]},
//{"nm":"黄河韩公悌","icn":100047,"lv":15,"pwr":1833,"rnk":9753,"winc":0,"heros":[{"nm":"孙尚香","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":101,"morp":0},{"nm":"蔡文姬","clr":"WHI","phs":0,"star":1,"lv":15,"hpp":95,"morp":0},{"nm":"黄盖","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":102,"morp":0},{"nm":"夏侯霸","clr":"WHI","phs":0,"star":1,"lv":16,"hpp":98,"morp":0},{"nm":"许褚","clr":"WHI","phs":0,"star":1,"lv":17,"hpp":99,"morp":0}]}],"_type":"SCChangeEnemies","_rs":1}

//{"act":"Arena.saveDefFormation","sid":"d883597992ae536fb03c3392b530d07700a837a6","body":"{\"heros\":[{\"x\":-2,\"y\":0,\"index\":5},{\"x\":-3,\"y\":1,\"index\":6},{\"x\":-5,\"y\":1,\"index\":4}],\"chief\":5}"}:""
//


//

function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.arena_nextTime == null)
        client.props.arena_nextTime = 0;
    if (now < client.props.arena_nextTime) {
        return false;
    }
    client.info("-----尝试处理 竞技场");

    var ret = client.sendAct("Arena.myArenaStatus");
    if (ret.cd == 0 && ret.leftTimes > 0) {
        var times = 10;
        var minpower = 100000000000;
        var name = null;
        var rank = 0;
        while ((times--) > 0) {
            ret = client.sendAct("Arena.changeEnemies");
            for (var i = 0; i < ret.list.length; i++) {
                var p = ret.list[i];
                if (p.pwr < minpower) {
                    minpower = p.pwr;
                    name = p.nm;
                    rank = p.rnk;
                }
            }
        }
        client.info("选中[" + name + "],战斗力:" + minpower + ",排名:" + rank);
        if (deal(client, name, rank)) {
            client.info("竞技场挑战成功");
        } else {
            client.info("竞技场挑战失败");
        }
    } else {
        if (ret.leftTimes == 0) {
            ret.cd = 3600;
        }
        client.props.arena_nextTime = now + ret.cd * 1000;
        client.info("竞技场冷却[" + ret.cd + "]秒");
    }
}

function deal(client, name, rank) {
    //发起攻击
    //{"act":"Arena.challenge","sid":"d883597992ae536fb03c3392b530d07700a837a6","body":"{\"rank\":8719,\"name\":\"河内卫公悌\"}"}:""
    var result = client.sendAct("Arena.challenge", {rank: rank, name: name});
    if (result.style == "ERROR") {
        client.info("Arena.challenge失败:" + API.encodeJson(result));
        return false;
    }

    var ret = client.runAI("attack");

    if (ret) {//如果战斗成功
        client.props.task_nextTime = 0;//立即清除任务提交等待
        client.props.market_nextTime = 0;//立即清除资源领取等待
        client.props.equip_nextTime = 0;//立即取消升级等待
    }
    return ret;
    //API.sleep(10000000000);
    //获取之前的阵型,这里AI不处理之前的阵型
    //{"act":"Campaign.getAttFormation","sid":"634671b583294ce0f1dc8ca678b54efc538ca640","body":"{\"march\":\"OPEN_CITY\"}"}
}

