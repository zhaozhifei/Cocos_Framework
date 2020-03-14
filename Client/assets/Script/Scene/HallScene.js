/*
 * @Author: mengjl
 * @Date: 2020-02-25 14:29:53
 * @LastEditTime: 2020-02-28 15:29:54
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Scene\HallScene.js
 */

let ItemMgr = require("ItemMgr")
let Utils = require("Utils")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    start () {
        let serverStringId = window.SystemInfo.serverStringId;
        if(serverStringId){
            window.ServerStorage.saveStart(serverStringId);
        }
    },

    // update (dt) {},

    onKeyDown(event)
    {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
            case cc.macro.KEY.back:
                Utils.showMessageBox(false, false, "确定要返回到登陆界面吗？", function () {
                    cc.director.loadScene('MainScene');
                }, function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.YellowCancel);
                break;
            case cc.macro.KEY.f4:
                break;
            default:
                break;
        }
    },

    onClickBeginGame()
    {
        cc.director.loadScene('GameScene');
    },

    onClickSetting()
    {
        let PanelManager = require("PanelManager");
        PanelManager.openPanel(window.PrefabType.PlayerPanel);
    },

    onClickGongGao()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_protocol, {type : 'notice'});
    },
});
