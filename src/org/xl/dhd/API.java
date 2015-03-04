/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.xl.dhd;

import com.yoekey.io.sock.SockLink;
import com.yoekey.util.game.DailyActMgr;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.channels.SocketChannel;
import org.json.JSONObject;
import org.xl.script.Script;

/**
 *
 * @author Administrator
 */
public class API {

    public static Object context = new Context();

    public static long now() {
        return System.currentTimeMillis();
    }

    /**
     * 获取日常间隔天数
     *
     * @param splitTime
     * @param lastTime
     * @return
     */
    public static int getDayDiff(String splitTime, long lastTime) {
        return DailyActMgr.getDayDiff(DailyActMgr.getSplitTime(splitTime), lastTime);
    }

    public static SockLink createSockLink(String host, int port) throws IOException {
        return new SockLink(SocketChannel.open(new InetSocketAddress(host, port)));
    }

    public static JSONObject decodeJSON(String str) {
        try {
            return new JSONObject(str);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    public static void info(Object obj) {
        Context.info("API.info:" + obj.toString());
    }

    public static void debug(Object obj) {
        Context.info("API.debug:" + obj.toString());
    }

    public static void sleep(long millis) throws InterruptedException {
        Thread.sleep(millis);
    }

    public static String encodeJson(Object obj) {
        return Script.encodeJson(obj);
    }

}
