let LoadManager = require("LoadManager");
let CallBackHelp = require("CallBackHelp");
let JsonConfig = require("JsonConfig");
let BigNumber = require("BigNumber");
let Utils = require("Utils");
let WXHelp = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        baseImg1: cc.SpriteAtlas,
        baseImg: cc.SpriteAtlas,
        label_lv: cc.Label,
        label_name: cc.Label,
        img_House: cc.Sprite,
        itemID: 0,
    },

    start() {

    },

    setData(data, itemID) {
        this.itemID = itemID;
        this.houseData = data;
        this.label_lv.string = "Lv." + data.lv;


        var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
        if (spriteFrame) {
            this.img_House.spriteFrame = spriteFrame;
        }
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.ChangeBuyCount, function (param) {
            self.refreshUI();
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.ChangeShopShareCount, function (param) {
            self.refreshUI();
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.ChangeTodayShareCount, function (param) {
            self.refreshUI();
        }, this);
        this.refreshUI();
    },

    refreshUI() {
        let data = this.houseData;
        let btn_buy = this.node.getChildByName("btn_buy");
        let label_buy = btn_buy.getChildByName("Label").getComponent(cc.Label);
        let icon_buy = btn_buy.getChildByName("icon_buy");
        let icon_logo = btn_buy.getChildByName("icon");
        label_buy.node.active = true;
        icon_logo.active = true;
        let sub = window.GameData.level - data.lv;
        this.img_House.node.color = cc.color(255, 255, 255);
        if ((window.GameData.level >= 10 && sub == 2) || (window.GameData.level >= 8 && sub == 3)) {
            //钻石
            btn_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("btn_buydiamond");
            icon_logo.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("icon_zuanshi");
            icon_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("icon_buy");
            label_buy.string = "" + Utils.getBuyDiamond(data.lv);
        }
        else if (window.GameData.level >= 5 && sub >= 4 ||
            (data.lv == 1 && window.GameData.level >= 3) ||
            (data.lv == 2 && window.GameData.level >= 5)) {
            //金币
            btn_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("btn_buygold");
            icon_logo.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("icon_house");
            icon_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("icon_buy");
            label_buy.string = "" + BigNumber.getShowString(Utils.getBuyCost(data.lv));
        }
        else if (sub < 0) {
            //不开放
            this.label_name.string = "????";
            label_buy.node.active = false;
            icon_logo.active = false;
            btn_buy.getComponent(cc.Button).enable = false;
            btn_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("btn_buylock");
            icon_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("icon_lock");
            this.img_House.node.color = cc.color(0, 0, 0);
        }
        else {
            //锁定
            this.label_name.string = "????";
            btn_buy.getComponent(cc.Button).enable = false;
            label_buy.node.active = false;
            icon_logo.active = false;
            btn_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("btn_buylock");
            icon_buy.getComponent(cc.Sprite).spriteFrame = this.baseImg1.getSpriteFrame("icon_lock");
            this.img_House.node.color = cc.color(0, 0, 0);
        }

        if (data.lv <= window.GameData.level) {
            this.img_House.node.color = cc.color(255, 255, 255);
            this.label_name.string = data.name;
        }

        let btn_buy2 = this.node.getChildByName("btn_buy2");
        let icon_btn2 = btn_buy2.getChildByName("icon").getComponent(cc.Sprite);


        if (window.GameData.level >= 8 && sub == 3) {
            // let videoJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Store_Monster);
            // if (parseInt(videoJson.count) < parseInt(videoJson.maxcount)) {
            //     //视频
            //     // btn_buy2.active = true;
            //     icon_btn2.spriteFrame = this.baseImg1.getSpriteFrame("icon_video");
            // }else{
            //     btn_buy2.active = false;
            // }
            btn_buy2.active = false;
        } else if (window.GameData.level >= 9 && sub == 5) {
            // let shareJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Store_Monster);
            // if (parseInt(shareJson.count) < parseInt(shareJson.maxcount)) {
                //分享
                btn_buy2.active = false;
                // icon_btn2.spriteFrame = this.baseImg1.getSpriteFrame("icon_share");
            // }
        }
        else {
            btn_buy2.active = false;
        }
    },

    btnClickBuy2() {
        let sub = window.GameData.level - this.houseData.lv;
        let self = this;
        if (window.GameData.level >= 5 && sub == 3) {
            //视频
            let videoJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Store_Monster);
            if (parseInt(videoJson.count) < parseInt(videoJson.maxcount)) {
                WXHelp.createVideo(window.BannerVedioId.ShopVideo, function () {
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Store_Monster);
                    CallBackHelp.callFunc(window.CallBackMsg.CreateHouse, self.houseData.lv);
                }, function () {
                    // Utils.showTips("看视频太频繁，请稍后再试...");
                    self.shareFun();
                }, function () { });
            } else {
                Utils.showTips("今日看视频获取房子次数已达上限...");
            }
        }
        else if (window.GameData.level >= 5 && sub == 5) {
            //分享
            // this.shareFun();
        }
    },

    shareFun: function () {
        let self = this;
        let shareJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Store_Monster);
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Store_Monster;
            if (parseInt(shareJson.count) < parseInt(shareJson.maxcount)) {
                window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Store_Monster);
                setTimeout(function () {
                    Utils.showTips("分享成功");
                    CallBackHelp.callFunc(window.CallBackMsg.CreateHouse, self.houseData.lv);
                }, 2000)
            } else {
                setTimeout(function () {
                    Utils.showTips("今日分享获得房子次数已到限制");
                }, 3000)
            }
        });
    },

    btnClickBuy() {
        let data = this.houseData;
        let sub = window.GameData.level - data.lv;
        if ((window.GameData.level >= 10 && sub == 2) || (window.GameData.level >= 8 && sub == 3)) {
            //钻石
            CallBackHelp.callFunc(window.CallBackMsg.BuyHouseByDiamond, data.lv);
        }
        else if (window.GameData.level >= 5 && sub >= 4 ||
            (data.lv == 1 && window.GameData.level >= 3) ||
            (data.lv == 2 && window.GameData.level >= 5)) {
            //金币
            CallBackHelp.callFunc(window.CallBackMsg.BuyHouse, data.lv);
        }
        else if (sub < 0) {
            //不开放
        }
        else {
            //锁定
        }
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },
});
