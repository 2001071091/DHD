/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var loginURL = "http://my.37.com/api/login.php?action=login&remember_me=1&save_state=1&ltype=1";
var enterURLs = {
    1: "http://game.37.com/play.php?game_id=292&sid=1"
    , 2: "http://game.37.com/play.php?game_id=292&sid=2"
    , 60: "http://game.37.com/play.php?game_id=292&sid=60"
}

function login(client) {
    var sid, gate;

    var http = client.http;
    var enterURL = enterURLs[client.serverId];
    var resp;
    if (http.hasCookie()) {
        client.info("不需要再登录,已经保存有cookie信息");
    } else {
        client.info("无cookie,重新调用[" + loginURL + "]");
        resp = http.request(loginURL + "&login_account=" + client.userName + "&password=" + client.password);
        client.saveCookie();
    }
    //进入游戏
    client.info("进入游戏跳转页[" + enterURL + "]");
    resp = http.request(enterURL);
    //client.info(resp);
    //解析游戏登录地址
    var start = resp.indexOf("<iframe");
    start = resp.indexOf("src=\"", start) + 5;
    var end = resp.indexOf("\"", start);
    var gameURL = resp.substring(start, end);

    client.info("解析出游戏连接[" + gameURL + "]");
    resp = http.request(gameURL);
    //解析服务器接口和登录Code
    start = resp.indexOf("gateway=") + 8;
    end = resp.indexOf("&", start);
    gate = resp.substring(start, end);
    client.info("解析出gateway[" + gate + "]");
    start = resp.indexOf("loginCode=") + 10;
    end = resp.indexOf("&", start);
    sid = resp.substring(start, end);
    client.info("解析出sid[" + sid + "]");

    client.info("sid[" + sid + "]");
    client.info("gateway[" + gate + "]");

    client.gateway = gate;
    //获取socket连接
    var result = client.sendAct("Login.serverInfo"); //http.request(gateway, "{\"act\":\"Login.serverInfo\"}:");
    //创建按socket连接
    client.link = API.createSockLink(result.tcpHost, result.tcpPorts[0]);

    result = client.sendAct("Login.login", {loginCode: sid, type: "WEB_BROWSER"});

    //API.info(API.encodeJson(result));
    client.props.guide = Number(result.guide);
    client.props.playerId = result.playerId;
    client.sid = sid;
    result = client.sendAct("Login.loginFinish");
}

