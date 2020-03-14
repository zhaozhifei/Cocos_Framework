let CallBackHelp = require("CallBackHelp");
let Utils = require("Utils");
let WXHelp = require("WXHelp");

let SIGN_REWARD = [88, 98, 108, 118, 128, 138, 148];

cc.Class({
    extends: cc.Component,

    properties: {
        yeaterBtn: cc.Button,
        todayBtn: cc.Button,
        baseImg: cc.SpriteAtlas,
    },

    start() {
        if (window.IsPhoneType == "pad") {
            this.node.scale = 0.7;
            this.node.getChildByName("layout").scale = 1.5;
        }

        this.serverTime = window.SystemInfo.getServerTime();
        this.showSignContent();

        // this.banner = WXHelp.userBanner(window.BannerVedioId.SignBanner);
        // if(this.banner){
        //     console.log('banner 广告显示');
        //     this.banner.show();
        // }
    },

    showSignContent: function () {
        let nodeSign = this.node.getChildByName("bg_image2").getChildByName("node_sign");
        let serverTime = this.serverTime;
        if (serverTime == 0) {
            nodeSign.active = false;
            return;
        }
        nodeSign.active = true;
        var date = new Date(serverTime);
        let day = date.getDay();//0-6

        var firstInGame_date = new Date(window.GameData.getFirstInGameTime());
        let firstInGame_day = firstInGame_date.getDay();//0-6

        let sub_today = (day - firstInGame_day) % 7;
        if (sub_today < 0) {
            sub_today += 7;
        }
        let sub_yesterday = (sub_today - 1) % 7;
        if (sub_yesterday < 0) {
            sub_yesterday += 7;
        }
        let sub_tomorrow = (sub_today + 1) % 7;
        if (sub_tomorrow < 0) {
            sub_tomorrow += 7;
        }

        let signTime = window.GameData.getSignTime();
        if (serverTime - signTime > 24 * 60 * 60 * 1000 * 3) {
            window.GameData.clearSignData();
        }

        let yester_sign = window.GameData.getSignData(sub_yesterday);
        let today_sign = window.GameData.getSignData(sub_today);

        let nodeYester = nodeSign.getChildByName("sprite_yesterday");
        let nodeToday = nodeSign.getChildByName("sprite_today");
        let nodeTomorrow = nodeSign.getChildByName("sprite_tomorrow");
        if (today_sign > 0) {
            this.todayBtn.interactable = false;
            this.setIsSgin(true, nodeToday);
        }
        else {
            this.todayBtn.interactable = true;
            this.setIsSgin(false, nodeToday);
        }
        if (yester_sign > 0) {
            this.yeaterBtn.interactable = false;
            this.setIsSgin(true, nodeYester)
        }
        else {
            this.yeaterBtn.interactable = true;
            this.setIsSgin(false, nodeYester)
        }
        nodeYester.day = sub_yesterday;
        nodeYester.diamond = SIGN_REWARD[sub_yesterday];
        nodeToday.day = sub_today;
        nodeToday.diamond = SIGN_REWARD[sub_today];
        nodeTomorrow.day = sub_tomorrow;
        nodeTomorrow.diamond = SIGN_REWARD[sub_tomorrow];
        nodeYester.getChildByName("label_gift").getComponent(cc.Label).string = nodeYester.diamond + "";
        nodeToday.getChildByName("label_gift").getComponent(cc.Label).string = nodeToday.diamond + "";
        nodeTomorrow.getChildByName("label_gift").getComponent(cc.Label).string = nodeTomorrow.diamond + "";
    },

    setIsSgin: function (isSgin, node) {
        var x = 0;
        var nodex = 0;
        var spframe;
        if (isSgin) {
            spframe = this.baseImg.getSpriteFrame("icon_yiqiandao");
            x = -15;
            if(node.name == "sprite_yesterday"){
                nodex = -155;
            }else{
                nodex = 10;
            }
        } else {
            spframe = this.baseImg.getSpriteFrame("icon_qiandao");
            x = 0;
            if(node.name == "sprite_yesterday"){
                nodex = -162;
            }else{
                nodex = 0;
            }
        }
        node.x = nodex;
        node.getComponent(cc.Sprite).spriteFrame = spframe;
        for (var i = 0; i < node.childrenCount; i++) {
            let child = node.children[i];
            child.x = x;
        }
    },

    btnClickSignTomrrow() {
        Utils.showTips("明天再来哟!");
    },

    btnClickSignToday: function (event) {
        let self = this;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Diamond_Chests; //TODO 签到
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    let signData = window.GameData.getSignData(event.currentTarget.day);
                    if (signData == 0) {
                        window.GameData.signToday(event.currentTarget.day);
                        window.GameData.setSignTime(self.serverTime);
                        self.getGift(event.currentTarget.diamond);
                        self.showSignContent();
                    }
                }else if (window.SystemInfo.isSuccess == 0) {
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                    window.SystemInfo.isSuccess = -1;
                }
            }, 800);
        });   
    },

    btnClickSignYesterday: function (event) {
        let self = this;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Diamond_Chests; //TODO 签到
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    let signData = window.GameData.getSignData(event.currentTarget.day);
                    if (signData == 0) {
                        window.GameData.signYesterday(event.currentTarget.day);
                        window.GameData.setSignTime(self.serverTime);
                        self.getGift(event.currentTarget.diamond);
                        self.showSignContent();
                    }
                } else if (window.SystemInfo.isSuccess == 0) {
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                    window.SystemInfo.isSuccess = -1;
                }
            }, 800);
        });
    },

    getGift: function (adddiamond) {
        var diamond = parseInt(window.GameData.diamond) + parseInt(adddiamond);
        if (isNaN(adddiamond)) {
            diamond = parseInt(window.GameData.diamond);
        }
        window.GameData.setDiamond(diamond);
        Utils.showMessageBox(false, true, "获得" + adddiamond + "钻石", function () {},function () {},function () {}, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
    },

    btnClickClose() {
        this.node.destroy();
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

    // onDestroy(){
    //     if(this.banner){
    //         this.banner.hide();
    //     }
    // }
});
