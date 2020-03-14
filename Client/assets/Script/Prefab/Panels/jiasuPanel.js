let Utils = require("Utils");
let WXHelp = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        gameNode:cc.Node,
    },

    start () {
        this.setOtherGameShow();
    },

    btnClickGetDiamond: function () {
        let self = this;
        if (parseInt(window.GameData.diamond) < 20) {
            Utils.showTips("钻石不够哦...")
        } else {
            Utils.showMessageBox(false, false, "是否花费20钻石加速" + window.diamondTime + "秒？", function () {
                self.node.destroy();
                Utils.showTips("加速成功");
                window.GameData.setDiamond(parseInt(window.GameData.diamond) - 20);
                window.GameData.setTimesTick(window.diamondTime + parseInt(window.GameData.addedTimesTick));
            }, function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.YellowCancel);
        }
    },

    btnClickShare: function () {
        let self = this;
        var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Speed_Up);
        var isSure = parseInt(json.count) < parseInt(json.maxcount);
        if (isSure) {
            var reward = window.GameData.getRewardSetting(window.RewardSetting.SpeedUp);
            var len = json.count;
            if (json.count >= reward.length) {
                len = reward.length - 1;
            }
            if (reward && reward[len] == 1) {
                self.showVideoSpeed();
            } else {
                self.showShare();
            }
        } else {
            Utils.showTips("今日分享加速次数已到限制");
        }
    },

    showVideoSpeed: function () {
        let self = this;
        WXHelp.createVideo(window.BannerVedioId.CurrencyVideo, function () {
            self.speedSuccess();
        }, function () {
            self.showShare();
        },function(){});
    },

    showShare: function () {
        let self = this;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Speed_Up;
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    self.speedSuccess();
                    window.SystemInfo.isSuccess = -1;
                } else if (window.SystemInfo.isSuccess == 0) {
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                    window.SystemInfo.isSuccess = -1;
                }
            }, 800);
        });
    },

    speedSuccess: function () {
        this.node.destroy();
        window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Speed_Up);
        Utils.showTips("加速成功");
        window.GameData.setTimesTick(window.shareTime + parseInt(window.GameData.addedTimesTick));
    },

    btnClickClose:function(){
        this.node.destroy();
    },

    setOtherGameShow:function(){
        let img1 = this.gameNode.getChildByName("node1").getChildByName("spr1").getComponent(cc.Sprite);
        let img2 = this.gameNode.getChildByName("node2").getChildByName("spr2").getComponent(cc.Sprite);
        let img3 = this.gameNode.getChildByName("node3").getChildByName("spr3").getComponent(cc.Sprite);
        Utils.createImage(window.SharePicUrl + "appicon/hunzipanda.png" ,img1);
        Utils.createImage(window.SharePicUrl + "appicon/biepengwo.png" ,img2);
        Utils.createImage(window.SharePicUrl + "appicon/tanqiu.png" ,img3);
    },

    btnClickNode:function(event){
        if(event.target.name == "node1"){
            WXHelp.navigateToMiniProgram(window.AppId[0]);  
        }else if(event.target.name == "node2"){
            WXHelp.navigateToMiniProgram(window.AppId[1]);  
        }else{
            WXHelp.navigateToMiniProgram(window.AppId[3]);  
        }
    }
});
