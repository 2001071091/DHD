/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.xl.dhd;

import com.yoekey.io.BytesReader;
import com.yoekey.io.BytesWriter;
import com.yoekey.io.protcl.nobound.CmdBuff;
import com.yoekey.io.sock.SockLink;
import com.yoekey.io.util.HttpClient;
import com.yoekey.io.util.StringOp;
import com.yoekey.util.game.ExtraField;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Stack;
import org.json.JSONException;
import org.xl.script.Script;

/**
 *
 * @author 王晓雷
 */
public class DHDClient implements Runnable {

    public SockLink link;
    private CmdBuff buff;
    public HttpClient http;

    public String platform;
    public int serverId;
    public String userName;
    public String password;
    public String sid;
    public String gateway;

    public Object props;

    private Stack<Object[]> pps;
    private ExtraField session;

    public DHDClient(String plat, int sid, String user, String pass) throws IOException {
        userName = user;
        password = pass;
        platform = plat;
        serverId = sid;
        props = Script.createMap();
        FileInputStream fin = null;
        try {
            fin = new FileInputStream("session/" + platform + "/" + serverId + "/" + userName);
            byte[] tmp = new byte[fin.available()];
            fin.read(tmp);
            session = ExtraField.fromBytes(new BytesReader(tmp));
        } catch (Exception ex) {
            //ex.printStackTrace();
            session = new ExtraField();
        } finally {
            if (fin != null) {
                fin.close();
            }
        }
        pps = new Stack<Object[]>();
        buff = new CmdBuff();
        http = new HttpClient(10000);
        http.loadCookie("cookies/" + platform + "/" + serverId + "/" + userName);
    }

    public Object getObject(String key) {
        return session.getObject(key);
    }

    public void setObject(String key, Object obj) throws IOException {
        String path = "session/" + platform + "/" + serverId + "/" + userName;
        session.setObject(key, obj);
        FileOutputStream fout = null;
        try {
            File file = new File(path);
            file.getParentFile().mkdirs();
            fout = new FileOutputStream(path);
            BytesWriter writer = new BytesWriter();
            session.readBytes(writer);
            fout.write(writer.getBytes());
            fout.flush();
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            if (fout != null) {
                fout.close();
            }
        }
    }

    public void saveCookie() throws IOException {
        http.saveCookie("cookies/" + platform + "/" + serverId + "/" + userName);
    }

    public void pushAI(Object... objs) {
        pps.push(objs);
    }

    public Object runAI(Object... objs) throws Exception {
        return Script.getScriptFromLibrary("ai." + objs[0]).invokeS("loop", this, objs);
    }

    public Object send(Object cmd) throws IOException, JSONException {
        Script.setMapElement(cmd, "sid", sid);
        String request = Script.encodeJson(cmd);
        //info(request);
        String resp = webSend(request);
        return Script.wrapJsonObj(API.decodeJSON(unwrapContent(resp)));
    }

    public Object sendAct(String act) throws IOException, JSONException {
        return sendAct(act, null);
    }

    public Object sendAct(String act, Object body) throws IOException, JSONException {
        String request = "{\"act\":\"" + StringOp.stringToScriptString(act) + "\"" + (sid != null ? ",\"sid\":\"" + sid + "\"" : "") + "" + (body != null ? ",\"body\":\"" + StringOp.stringToScriptString(Script.encodeJson(body)) + "\"" : "") + "}";
        //info(request);
        String resp = webSend(request);
        //info(resp);
        return Script.wrapJsonObj(API.decodeJSON(unwrapContent(resp)));
    }

    public void socketLogin() {
        this.sockSend("{\"session\":\"" + sid + "\"}");
    }

    public void sockSend(String cmd) {
        BytesWriter writer = new BytesWriter();
        writer.writeString(cmd);
        link.sendBytes(writer.getBytes());
    }

    public String webSend(String cmd) throws IOException {
        return http.request(gateway, cmd);
    }

    public String unwrapContent(String resp) {
        String content = resp.split("\r\n\r\n")[1];
        if (resp.indexOf("chunked") > 0) {
            //内容是否采用chunked分段
            String[] tmp = content.split("\r\n");
            content = "";
            for (int i = 0; i < tmp.length; i++) {
                if (i % 2 == 1) {
                    content += tmp[i];
                }
            }
        }
        return content;
    }

    public Object getSockJson() throws IOException, JSONException {
        String resp = getSockInfo();
        if (resp == null) {
            return null;
        }
        return Script.wrapJsonObj(API.decodeJSON(resp));
    }

    public String getSockInfo() throws IOException {
        String result = null;
        //获取命令
        int len = buff.writeSocketChannel(link.getChannel());
        if (len > 0 || buff.getPosition() > 0) {
            if (buff.getPosition() >= buff.getCmdLenNoVerif() + 4) {
                result = new BytesReader(buff.getBytes()).readString();
                //info("sock\t" + result);
                buff.remove(0, (int) buff.getCmdLenNoVerif() + 4);
            }
            //System.out.println(buff.getCmdLenNoVerif()+","+);
        }
        return result;
    }

    @Override
    public void run() {

        info("尝试登录...");
        while (true) {
            try {
                //this.webLogin();
                Script.getScriptFromLibrary("login." + platform).invokeS("login", this);
                break;
            } catch (Exception ex) {
                //ex.printStackTrace();
                info("登录失败[" + ex.getMessage() + "],重试");
            }
        }

        info("sock 登录...");
        socketLogin();
        while (true) {
            try {
                if ("true".equals(getSockInfo())) {
                    break;
                }
                Thread.sleep(1000);
            } catch (Throwable ex) {
            }
        }

        info("登录成功");

        try {
            while (true) {
                //处理智能
                if (pps.isEmpty()) {
                    pps.push(new Object[]{"idle"});//如果没有任何目标则设置为等级100
                }
                Object[] pp = pps.peek();

                if ((Boolean) Script.getScriptFromLibrary("ai." + pp[0]).invokeS("loop", this, pp)) {
                    pps.remove(pp);
                }

                getSockInfo();

                Thread.sleep(1000);
            }
        } catch (Throwable ex) {
            ex.printStackTrace();
            info("连接出现异常:" + ex.getMessage());
        }
        //throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public void info(String msg) {
        API.info(platform + "." + serverId + "." + userName + "\t" + msg);
    }
}
