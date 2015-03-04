/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var PROPERTIES = 0x01;
var OPEN_CITY = 0x02;
var PLAYER_CITY_INFO = 0x04;
var HERO_LIST = 0x08;
var BAG_INFO = 0x10;

function loop(client, args) {
    /**
     * client.props.props 角色信息
     * client.props.cities 开启城市信息
     * client.props.cityNum 开启城市数量
     * client.props.cityInfo 当前城市信息{"curCity":1,"state":"PARKING"}
     */
    var option = args[1];
    //获取自身等级
    if ((option & PROPERTIES) == PROPERTIES) {
        var result = client.sendAct("Player.getProperties");
        if (client.props.props == null) {
            client.props.props = {};
        }
        for (var i = 0; i < result.pvs.length; i++) {
            client.props.props[result.pvs[i].p] = result.pvs[i].v;
        }
        //client.info(API.encodeJson(client.props.props));
        //var lv = Number(client.props.props["LEVEL"]);
    }

    if ((option & OPEN_CITY) == OPEN_CITY) {
        //判定开启的城市
        //{"act":"World.getAllOpenedCities","sid":"634671b583294ce0f1dc8ca678b54efc538ca640"}
        //{"cities":{"50":1}}
        result = client.sendAct("World.getAllOpenedCities");
        client.props.cities = {};
        client.props.cityNum = 0;
        for (var ids in result.cities) {
            client.props.cities[ids] = result.cities[ids];
            client.props.cityNum++;
        }
    }

    if ((option & PLAYER_CITY_INFO) == PLAYER_CITY_INFO) {
        //{"act":"City.getPlayerCityInfo","sid":"634671b583294ce0f1dc8ca678b54efc538ca640"}
        //{"curCity":1,"state":"PARKING"}
        result = client.sendAct("City.getPlayerCityInfo");
        client.props.cityInfo = result;
    }

    if ((option & BAG_INFO) == BAG_INFO) {
        result = client.sendAct("Bag.getBagInfo");
        client.props.items = {};//名称索引
        for (var i = 0; i < result.items.length; i++) {
            client.props.items[result.items[i].nm] = result.items[i];
            //{idx:序号,nm:名称,n:数量,}
        }
    }

    if ((option & HERO_LIST) == HERO_LIST) {
        result = client.sendAct("Hero.getPlayerHeroList");
        client.props.heros = result.heros;
        client.props.herosNameIndex = {};//名称索引
        client.props.herosArmyIndex = {};//兵种索引
        client.props.hero_maxLv = 0;
        for (var i = 0; i < client.props.heros.length; i++) {
            client.props.herosNameIndex[client.props.heros[i].nm] = client.props.heros[i];
            if (client.props.heros[i].lv > client.props.hero_maxLv) {
                client.props.hero_maxLv = client.props.heros[i].lv;
            }
        }
        for (var i = 0; i < client.props.heros.length; i++) {
            var arr = client.props.herosArmyIndex[client.props.heros[i].army];
            if (arr == null) {
                client.props.herosArmyIndex[client.props.heros[i].army] = [];
                arr = client.props.herosArmyIndex[client.props.heros[i].army];
                arr.push(client.props.heros[i]);
            } else {
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j].power < client.props.heros[i].power) {
                        arr.splice(j, 0, client.props.heros[i]);
                        break;
                    }
                    if (j == arr.length - 1) {
                        arr.push(client.props.heros[i]);
                        break;
                    }
                }
            }
        }
    }
}
