let JsonConfig = require("JsonConfig");
let LoadManager = require("LoadManager");
let Utils = require("Utils");
let WXHelp = require("WXHelp");
let AudioHelp = require("AudioHelp");

cc.Class({
    extends: cc.Component,

    properties: {
        imgOldHouse: cc.Sprite,
        imgNewHouse: cc.Sprite,
        btnClose: cc.Button,
        labelold:cc.Label,
        labelnew:cc.Label,
        labeloldlv:cc.Label,
        labelnewlv:cc.Label,
        btnGet:cc.Button,
    },

    start(){
        if(window.IsPhoneType == "pad"){
            this.node.scale = 0.7;
            this.node.getChildByName("Layout").scale = 1.5;
        }
    },

    init: function (leftGold,lv,target) {
        var data = JsonConfig.getRowWithKV("lv", lv, "HouseConfig");
        var data1 = JsonConfig.getRowWithKV("lv", lv+1, "HouseConfig");
        this.leftGold = leftGold;
        this.lv = lv;
        this.target = target;
        this.scheduleOnce(function () { this.btnClose.node.active = true }.bind(this), 1.5);
        this.labelold.string = data.name;
        this.labelnew.string = data1.name ;
        this.labeloldlv.string =  lv ;
        this.labelnewlv.string = lv+1;
       
        var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
        if (spriteFrame) {
            this.imgOldHouse.spriteFrame = spriteFrame;
        }
        var spriteFrame1 = LoadManager.getSpriteFrameWithKey(data1.image);
        if (spriteFrame1) {
            this.imgNewHouse.spriteFrame = spriteFrame1;
        }
    },

    btnClickClose: function () {
        var House = this.target.createHouse(this.lv);
        if (House != null) {
            window.GameData.setGold(this.leftGold);
            window.GameData.addBuyCount(this.lv);
            AudioHelp.playSimpleAudioEngine("buyhouse", 0.7);
        }else {
            Utils.showTips("创建房子失败")
        }
        this.node.destroy();
    },

    btnClickDecoration: function () {
        let self = this;
        this.btnGet.interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Diamond_Chests;  //TODO 进阶
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    var House = self.target.createHouse(self.lv + 1);
                    if (House != null) {
                        self.node.destroy();
                        Utils.showTips("分享成功");
                        window.GameData.setGold(self.leftGold);
                        window.GameData.addBuyCount(self.lv);
                        AudioHelp.playSimpleAudioEngine("buyhouse", 0.7);
                    }else {
                        Utils.showTips("创建房子失败")
                    }
                } else if (window.SystemInfo.isSuccess == 0) {
                    window.SystemInfo.isSuccess = -1;
                    self.btnGet.interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                    
                }
            }, 800);
        });
    },
});
