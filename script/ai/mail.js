/* 
 * 大皇帝获取邮件脚本
 */

function loop(client, args) {
    var now = API.now();
    //处理冷却延迟
    if (client.props.mail_nextTime == null)
        client.props.mail_nextTime = 0;
    if (now < client.props.mail_nextTime) {
        //client.info("民生需要等待" + Math.ceil((client.props.patrol_nextTime - now) / 1000) + "秒");
        return false;
    }
    client.info("-----尝试获取邮件");
    //{"act":"Email.openInBox","sid":"bb777ba1bd0e7d16bddec4d5939a2c58bcfc964d"}
    var ret = client.sendAct("Email.openInBox");//获取邮件列表
    var mails = ret.emails;
    if (mails != null)
        for (var i = 0; i < mails.length; i++) {
            var mail = mails[i];
            var id = mail.id;
            var subject = mail.subject;
            ret = client.sendAct("Email.read", {emailId: id});
            if (!ret.isGot && ret.record != null) {
                client.info("获取邮件[" + subject + "]的附件[" + API.encodeJson(ret.record) + "]");
                ret = client.sendAct("Email.getAttachment", {emailId: id});
            }
        }
    client.info("邮件获取完毕,设定1小时后再次获取");
    client.props.mail_nextTime = now + 3600000//设定一小时后再次获取邮件

    return true;
}
