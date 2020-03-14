let JsonConfig = require("JsonConfig");
let Utils = require("Utils");
let BigNumber = require("BigNumber");
let WXHelp  = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        labelCon: cc.Label,
        labelOwner: cc.Label,
        imgHead:cc.Sprite,
        baseImg:cc.SpriteAtlas,

        labelInput:cc.Label,
        needanim:cc.Node,
        otherNode1:cc.Node,
        ownerbtn:cc.Node,
        ownerchat:cc.Node,

        btnGet:cc.Button,
    },

    start() {
        if (window.IsPhoneType == "pad") {
            this.node.scale = 0.7;
            this.node.getChildByName("Layout").scale = 1.5;
        }
    },

    init: function (gold) {
        this.gold = gold;
        let chatData = JsonConfig.loadItems.DataConfig.OwnerChatData;
        let index = Utils.random(39,0);
        this.labelCon.string = chatData[index].string1;
        this.labelOwner.string = chatData[index].string2;
        let sex = chatData[index].sex;
        if(sex == "1"){
            this.imgHead.spriteFrame = this.baseImg.getSpriteFrame("img_nan");
        }else{
            this.imgHead.spriteFrame = this.baseImg.getSpriteFrame("img_nv");
        }

        this.stopAnim();
        this.animForChat();
    },

    stopAnim:function(){
        this.needanim.stopAllActions();
        this.otherNode1.active = false;
        this.ownerbtn.active = false;
        this.ownerchat.active = false;
    },

    animForChat:function(){
        var action = cc.sequence(
            cc.delayTime(0.4),
            cc.callFunc(function(){
                this.ownerchat.active = true;
            },this),
            cc.delayTime(0.4),
            cc.callFunc(function(){
                this.otherNode1.active = true;
            },this),
            cc.delayTime(0.4),
            cc.callFunc(function(){
                this.ownerbtn.active = true;
            },this),
        )

        this.needanim.runAction(action);
    },

    btnClickClose: function () {
        window.GameData.setOwnerchattime(Utils.random(50,30));
        this.node.destroy();
    },

    btnClickChat: function () {
        let self = this;
        this.btnGet.interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.OwnerChat
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    self.node.destroy();
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.OwnerChat);
                    let draw = self.getGoldOrDiamond();
                    window.GameData.setOwnerchattime(Utils.random(50,30));
                    Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(draw[0]) +draw[1], function () {},
                    function () {
                        if(self.node){
                            self.node.destroy();
                        }
                    },function () {
                        if(self.node){
                            self.node.destroy();
                        }
                    }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                } else if (window.SystemInfo.isSuccess == 0) {
                    window.SystemInfo.isSuccess = -1;
                    self.btnGet.interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                }
            }, 800);
        });
    },

    getGoldOrDiamond:function(){
        let draw = Utils.randomDraw(["gold","diamond"],[0.9,0.1]);
        if(draw == "gold"){
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.OwnerReward).chance[0];
            var rate = json.rate * 10;
            var gold = BigNumber.mul(this.gold , rate.toString());
            gold = gold.substring(0, gold.length - 1);
            window.GameData.setGold(BigNumber.add(window.GameData.gold , gold.toString()))
            return [gold , "金币"]
        }else{
            var diamond = Utils.random(78,26);
            window.GameData.setDiamond(parseInt(window.GameData.diamond)  + diamond);  
            return [diamond , "钻石"]
        }
    },
});
