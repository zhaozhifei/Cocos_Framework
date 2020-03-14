/*
 * @Author: mengjl
 * @Date: 2020-02-24 13:08:27
 * @LastEditTime: 2020-02-28 14:23:11
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogAccountLogin.js
 */

let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {
        base_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },

        toggle_node : {
            default: null,
            type: cc.Toggle,
            tooltip : "遮罩透明度",
        },
    },

    onLoad () {
        this.base_node.y = (-cc.winSize.height) / 2 + 300;
    },

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        // cc.sys.localStorage.setItem(window.StorageKey.ShareCount, dataArr);
        var isAgreeDeal = cc.sys.localStorage.getItem('is_agree_deal');
        if (isAgreeDeal && isAgreeDeal == 1) {
            this.toggle_node.check();
        }
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    onClickProtocol1()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_protocol, {type : 1});
    },

    onClickProtocol2()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_protocol, {type : 2});
    },

    onToggleEvent(target, evt)
    {
        var isAgreeDeal = cc.sys.localStorage.getItem('is_agree_deal');
        if (isAgreeDeal && isAgreeDeal == 1) {
            return;
        }
        
        if (this.toggle_node.isChecked) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_sure, {callback : (res)=>{
                if (res == 1) {
                    this.toggle_node.uncheck();
                }
            }});
        }
    },

    onLogin()
    {
        // if (!this.toggle_node.isChecked) {
        //     unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '请勾选同意下方的用户服务协议与游戏隐私政策'});
        //     return;
        // }

        cc.sys.localStorage.setItem('is_agree_deal', 1);
        unit.DialogMgr.showDialog(unit.DialogID.dialog_login);
    },
    
});
