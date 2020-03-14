/*
 * @Author: mengjl
 * @Date: 2020-02-10 20:00:15
 * @LastEditTime: 2020-02-26 16:52:22
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Scene\MainScene.js
 */
let WXHelp = require("WXHelp");
let AudioHelp = require("AudioHelp");

cc.Class({
    extends: cc.Component,

    properties: {    
        progressBar :cc.ProgressBar,
    },

    
    onLoad () {
        this.progressBar.node.active = false;
        unit.DialogMgr.showDialog(unit.DialogID.dialog_account_login);
    }, 

    start () {
        cc.game.setFrameRate(40);
        AudioHelp.playBackAudioEngine("game_bg");

        //背景图移动
        let img_background = this.node.getChildByName("img_background");
        var action = cc.repeatForever(cc.sequence(
            cc.moveBy(5,-200,0),
            cc.delayTime(0.3),
            cc.moveBy(5,200,0),
            cc.moveBy(5,200,0),
            cc.delayTime(0.3),
            cc.moveBy(5,-200,0),
        ));
        img_background.runAction(action);

        if(cc.sys.platform == cc.sys.WECHAT_GAME) {
            WXHelp.aboutShare();
            //微信平台
            WXHelp.initThis(this.node.getChildByName("btn_login"),this.progressBar);
        }
        else{
            // this.node.getChildByName("btn_login").active = true;

            // let serverStringId = cc.sys.localStorage.getItem(window.StorageKey.ServerStringId);
            // if(serverStringId){
            //     window.ServerStorage.saveStart(serverStringId);
            // }
        }
    },

    btnClickLogin(){
        // cc.log("SceneName:" + cc.director.getScene().name);
        if(cc.director.getScene().name == "MainScene"){
            cc.director.loadScene('LoadScene');
        }
    },
});
