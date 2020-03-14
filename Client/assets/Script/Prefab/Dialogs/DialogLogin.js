/*
 * @Author: mengjl
 * @Date: 2020-02-24 15:58:32
 * @LastEditTime: 2020-02-25 16:12:37
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogLogin.js
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
        toggle_node : {
            default: null,
            type: cc.Toggle,
            tooltip : "遮罩透明度",
        },
        scroll_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
        item_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
        scroll_view : {
            default: null,
            type: cc.ScrollView,
            tooltip : "遮罩透明度",
        },
    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        this.scroll_view.node.active = false;
        
        this.toggle_node.uncheck();
        var is_remember_password = cc.sys.localStorage.getItem('is_remember_password');
        if (is_remember_password && is_remember_password == 1) {
            this.toggle_node.check();
        }

        this.initAccounts();
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    initAccounts()
    {
        this.scroll_node.removeAllChildren();
        var list = LoginMgr.getAllAccounts();
        for (const key in list) {
            const element = list[key];
            var item = cc.instantiate(this.item_node);
            item.active = true;
            this.scroll_node.addChild(item);

            item.username = key;
            item.userpass = element;
            cc.find('lbl', item).getComponent(cc.Label).string = key;
        }
    },

    onClickLogin()
    {
        var username = this.edit_nodes[0].string;
        var userpass = this.edit_nodes[1].string;
        // var realName = this.edit_nodes[2].string;
        // var IDCard = this.edit_nodes[3].string;

        if (LoginMgr.isExitChinese(username)) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '账号中不能包含中文'});
            return;
        }
        if (LoginMgr.isExitChinese(userpass)) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '密码中不能包含中文'});
            return;
        }

        let md5 = require("md5");
        var _userpass = md5.md5(userpass);

        LoginMgr.onLogin(username, _userpass, (resp)=>{
            if (resp) {
                if (resp.errcode == 0) {
                    cc.director.loadScene('LoadScene');
                } else {
                    unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : resp.errmsg});
                }
            }
            else
            {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '请求服务器失败'});
            }
        });

        var is_remember_password = cc.sys.localStorage.getItem('is_remember_password');
        if (this.toggle_node.isChecked) {
            cc.sys.localStorage.setItem('is_remember_password', 1);
            LoginMgr.saveAccounts(username, userpass);
        }
        else
        {
            cc.sys.localStorage.setItem('is_remember_password', 0);
        }
    },

    onClickQuickLogin()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_quick_login);
        this.closeDialog();
    },

    onClickShowSelect()
    {
        this.scroll_view.node.active = !this.scroll_view.node.active;
    },
    
    onClickSelcet(params)
    {
        this.edit_nodes[0].string = params.target.username;
        this.edit_nodes[1].string = params.target.userpass;
        this.scroll_view.node.active = false;
    },
});
