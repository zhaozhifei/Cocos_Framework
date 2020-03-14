/*
 * @Author: your name
 * @Date: 2020-02-27 10:13:08
 * @LastEditTime: 2020-02-27 17:17:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Prefab\Items\MapBlock.js
 */
let CallBackHelp = require("CallBackHelp");
let Utils = require("Utils");
let WXHelp = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
       img_maparea :cc.Sprite,
       img_autoTip:cc.Sprite,

       locklabel:cc.Label,
    },

    start () {
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.ChangeLevel,function(param){
            self.checkLock();
        },this);
        CallBackHelp.addCall(window.CallBackMsg.ChangeShare,function(param){
            self.checkLock();
        },this);

        this.hideAutoTip();
    },  

    setStandHouse(house,action){
        this.standHouse = house;
    },
    
    setData(data){
        this.blockData = data;
        this.checkLock();
    },

    getIsLock(){
        return this.isLock; 
    },

    checkLock(){ 
        this.locklabel.node.active = false;
        let a = true;
        let b = true;
        if(window.GameData.share >= this.blockData.lockShare){
            a = false;
        }
        if(window.GameData.level >= this.blockData.lockLV){
            b = false;
        }
        var c = a && b;
        this.isLock = c;
        if(c){
            this.img_maparea.node.color = cc.color(129,126,126);
            if(this.blockData.flag == 1){
                this.locklabel.node.active = true;
                this.locklabel.string = "Lv." + this.blockData.lockLV + "\n" + "解锁";
            }
        }else{
            this.img_maparea.node.color = cc.color(255,255,255);
        }
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

    btnClickMapMsg:function(){
        if(this.isLock){
            // Utils.showMessageBox(false,false,"房子等级达到" + this.blockData.lockLV + "级\n或邀请" + this.blockData.lockShare +"位玩家(已邀请"+ window.GameData.share +"位)\n即可解锁该区域。",function(){},
            // function(){
                // WXHelp.shareGroup();
            // },function(){},window.MessageBoxSpr.GreenOk,window.MessageBoxSpr.BlueInvite); 
            Utils.showMessageBox(false,false,"房子等级达到" + this.blockData.lockLV + "级" + "\n即可解锁该区域。",function(){},
            function(){
                // WXHelp.shareGroup();
            },function(){},window.MessageBoxSpr.GreenOk,window.MessageBoxSpr.GreenOk); 
        }
    },

    showAutoTip:function(){
        this.img_autoTip.node.active = true;
    },

    hideAutoTip:function(){
        this.img_autoTip.node.active = false;
    }
});
