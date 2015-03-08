/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.xl.dhd;

import com.yoekey.util.game.NestPath;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import org.apache.log4j.PropertyConfigurator;
import org.xl.script.Script;

/**
 *
 * @author Administrator
 */
public class Boot {

    public static void main(String[] args) throws Exception, Throwable {
        PropertyConfigurator.configure("log4j.properties");
        /**
         * 加载脚本库
         */
        Script.japiName = "API";
        Script.japiInstance = "org.xl.dhd.API;API.context=org.xl.dhd.Context";
        Context.loadScript();

        //API.info(API.encodeJson(Context.getConfig("playoperRandomNameLast")));
        //API.info(API.encodeJson(Context.getConfig("ranchUpInfo")));
        //API.sleep(10000000);
        /**
         * 加载路径
         */
        ArrayList<Object[]> nestInfos = new ArrayList<Object[]>();
        HashMap<Integer, ArrayList<Integer>> cityMap = new HashMap<Integer, ArrayList<Integer>>();
        Object paths = Context.getConfig("cityPath");
        Object poss = Context.getConfig("cityPos");
        for (int i = 0; i < Script.getArrayLen(paths); i++) {
            Object row = Script.getArrayElement(paths, i);
            int id1 = (Integer) Script.getArrayElement(row, 0);
            int id2 = (Integer) Script.getArrayElement(row, 1);
            ArrayList<Integer> near1 = cityMap.get(id1);
            ArrayList<Integer> near2 = cityMap.get(id2);
            if (near1 == null) {
                near1 = new ArrayList<Integer>();
                cityMap.put(id1, near1);
            }
            if (near2 == null) {
                near2 = new ArrayList<Integer>();
                cityMap.put(id2, near2);
            }
            near1.add(id2);
            near2.add(id1);
        }
        Iterator<Integer> it = cityMap.keySet().iterator();
        while (it.hasNext()) {
            int id = it.next();
            Object pos = Script.getMapElement(poss, id);
            nestInfos.add(new Object[]{
                id, Script.getMapElement(pos, "x"), Script.getMapElement(pos, "y"), cityMap.get(id).toArray()
            });
        }
        Context.paths = new NestPath(nestInfos);

        //dhdauto01,nbauto
        //dhdauto02,nbauto
        //dhdauto03,nbauto
        //(new Thread(new DHDClient("37wan", 2, "2001071091", "123456"))).start();
        (new Thread(new DHDClient("37wan", 2, "dhdauto01", "nbauto"))).start();
        //List<Integer> path =Context.paths.find(1, 129);
        while (true) {
            Thread.sleep(1000);
        }
    }
}
