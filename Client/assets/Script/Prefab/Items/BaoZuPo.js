let Utils = require("Utils");
let CallBackHelp = require("CallBackHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        imgbaozupo: cc.Node,
    },

    initCallBack: function () {
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.ChangeOwnerChatTime, function (param) {
            if (window.GameData.ownerchattime <= 0 && window.GameData.level >= window.OpenLevel.BaoZuPo ) {
                var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.OwnerChat);
                if(parseInt(json.count) < parseInt(json.maxcount)){
                    self.setRun();
                }
            }
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.ClickBaoZuPo, function (param) {
            self.setDaiJi();
        }, this);
    },

    start() {
        this.setDaiJi();
        this.initCallBack();
    },

    setDaiJi() {
        this.node.x = 265;
        this.node.y = 320;
        this.node.stopAllActions();

        var action = cc.repeatForever(cc.sequence(
            cc.scaleTo(0.2, 1, 1),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "daiji", true);
            }.bind(this)),
            cc.delayTime(Utils.random(15,6)),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "diao", true);
            }.bind(this)),
            cc.delayTime(1),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "daiji", true);
            }.bind(this)),
            cc.delayTime(Utils.random(8,4)),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "dalaba", false);
            }.bind(this)),
            cc.delayTime(1),
        ));
        this.node.runAction(action);
    },

    setRun: function () {
        this.node.stopAllActions();
        this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "go", true);
        var action = cc.repeatForever(cc.sequence(
            cc.scaleTo(0.5, 1, 1),
            cc.moveTo(1.7, cc.v2(Utils.random(100, -100), 320)),
            cc.callFunc(function(){
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "daiji", true);
            }.bind(this)),
            cc.delayTime(4),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "go", true);
            }.bind(this)),
            cc.moveTo(1.7, cc.v2(-400,  320)),
            cc.scaleTo(0.5, -1, 1),
            cc.moveTo(1.7, cc.v2(Utils.random(100, -100),  320)),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "daiji", true);
            }.bind(this)),
            cc.delayTime(4),
            cc.callFunc(function () {
                this.imgbaozupo.getComponent("sp.Skeleton").setAnimation(0, "go", true);
            }.bind(this)),
            cc.moveTo(1.7, cc.v2(380,  320),
                cc.delayTime(3),
            )));
        this.node.runAction(action);
    },

});
