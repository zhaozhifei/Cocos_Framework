/*
 * @Author: mengjl
 * @Date: 2020-02-24 15:58:37
 * @LastEditTime: 2020-02-26 16:47:46
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogQuickLogin.js
 */

let DialogBase = require("DialogBase")
let LoginMgr = require("LoginMgr")

cc.Class({
    extends: DialogBase,

    properties: {
        edit_nodes : {
            default: [],
            type: [cc.EditBox],
            tooltip : "遮罩透明度",
        },
    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    onClickReg()
    {
        var username = this.edit_nodes[0].string;
        var userpass = this.edit_nodes[1].string;
        var realName = this.edit_nodes[2].string;
        var IDCard = this.edit_nodes[3].string;

        if (LoginMgr.isExitChinese(username)) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '账号中不能包含中文'});
            return;
        }
        if (LoginMgr.isExitChinese(userpass)) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '密码中不能包含中文'});
            return;
        }

        if (userpass.length < 6) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '至少输入6位以上的密码'});
            return;
        }

        // cc.log(userpass, userpass.length)
        // return;

        let md5 = require("md5");
        var _userpass = md5.md5(userpass);

        LoginMgr.onRegster(username, _userpass, realName, IDCard, (resp)=>{
            if (resp) {
                if (resp.errcode == 0) {
                    cc.director.loadScene('LoadScene');
                } else {
                    if (resp.errcode == -5) {
                        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '未满 18 岁，不能进行游戏！'});
                    } 
                    else if (resp.errcode == 5) {
                        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '账号已存在'});
                    } 
                    else {
                        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : resp.errmsg});
                    }
                }
            }
            else
            {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '请求服务器失败'});
            }
        });
    },

});
