/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.xl.dhd;

import com.yoekey.io.BytesReader;
import com.yoekey.util.game.ClientException;
import com.yoekey.util.game.NestPath;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import org.apache.log4j.Logger;
import org.xl.script.Script;

/**
 *
 * @author Administrator
 */
public class Context {

    /**
     * 刷新脚本
     *
     * @throws java.lang.Exception
     */
    public static void loadScript() throws Exception {
        //consleWriteln("Context.loadScript", "开始加载脚本库文件");
        Context.info("开始加载脚本库文件");
        Script.loadLibraryScripts("script");

        Context.info("脚本库刷新完毕[" + Script.getLibrary().size() + "]");
    }
    
    public static NestPath paths;

    private static HashMap<String, Object> configCache = new HashMap<String, Object>();

    public static Object getConfig(String name) throws FileNotFoundException, IOException, Exception {
        if (configCache.containsKey(name)) {
            return configCache.get(name);
        }
        FileInputStream fread = new FileInputStream("config/" + name + ".tbl");
        byte[] buff = new byte[fread.available()];
        fread.read(buff);
        fread.close();
        BytesReader reader = new BytesReader(buff);
        configCache.put(name, Script.getScriptFromLibrary("parser/" + name).invokeS("parser", reader));
        return configCache.get(name);
    }
    /**
     * 游戏中使用的日志格式
     */
    private static SimpleDateFormat logDateFormat = new SimpleDateFormat("HH:mm:ss");
    private static Logger logger = Logger.getLogger(Context.class);

    /**
     * 获取当前日期
     *
     * @return
     */
    public static Date currentDate() {
        return new Date();
    }

    public static void info(String msg) {
        info(msg, null);
    }

    /**
     * 运行信息
     *
     * @param msg
     * @param e e
     */
    public static void info(String msg, Throwable e) {
        e = Script.unwrapEx(e);
        String show = logDateFormat.format(currentDate()) + "\tINFO\t" + msg;
        //trace(show, e != null?e:"");
        logger.info(msg, e);
    }

    public static void debug(String msg) {
        debug(msg, null);
    }

    /**
     * 调式信息
     *
     * @param msg
     * @param e e
     */
    public static void debug(String msg, Throwable e) {
        e = Script.unwrapEx(e);
        String show = logDateFormat.format(currentDate()) + "\tDEBUG\t" + msg;
        //trace(show, e != null?e:"");
        logger.debug(msg, e);
    }

    public static void warn(String msg) {
        warn(msg, null);
    }

    /**
     * 警告
     *
     * @param msg
     * @param e e
     */
    public static void warn(String msg, Throwable e) {
        e = Script.unwrapEx(e);
        String show = logDateFormat.format(currentDate()) + "\tWARN\t" + msg;
        //trace(show, e != null?e:"");
        logger.warn(msg, e);
    }

    public static void error(String msg) {
        error(msg, null);
    }

    /**
     * 错误信息
     *
     * @param msg
     * @param e e
     */
    public static void error(String msg, Object e) {
        Throwable ex = Script.unwrapEx(e);
        if (ex != null && ex instanceof ClientException) {
            return;
        }
        String show = logDateFormat.format(currentDate()) + "\tERROR\t" + msg;
        //trace(show, e != null?e:"");
        logger.error(msg, ex);
    }
}
