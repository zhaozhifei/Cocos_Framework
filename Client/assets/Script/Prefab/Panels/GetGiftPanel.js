//礼盒打开
let Utils = require("Utils");
let WXHelp = require("WXHelp");
let JsonConfig = require("JsonConfig");
let BigNumber = require("BigNumber");
let LoadManager = require("LoadManager");
let CallBackHelp = require("CallBackHelp");
let AudioHelp = require("AudioHelp");

cc.Class({
    extends: cc.Component,

    properties: {
        img_gift: cc.Sprite,
        labelContent: cc.Label,
        btnVideoSpr: cc.Sprite,
        btnVideomul: cc.Sprite,
        baseImg: cc.SpriteAtlas,
        baseImg_1: cc.SpriteAtlas,
        anim: cc.Node,
        needShowNode: cc.Node,

        moneyNode:cc.Node,
        houseNode:cc.Node,
        imghousedi:cc.Sprite,
        imghousegao:cc.Sprite,
        labeloldlv:cc.Label,
        labelnewlv:cc.Label,
        labelold:cc.Label,
        labelnew:cc.Label,

        type: null,
        giftCount: 0,
        target: null,
    },

    start() {
        if (window.IsPhoneType == "pad") {
            this.node.scale = 0.7;
            this.node.getChildByName("Layout").scale = 1.5;
        }
    },

    startAnim: function (type, target) {
        if(type == 2){
            this.anim.active = false;
            this.needShowNode.active = true;
            this.init(type, target);
            return;
        }
        this.needShowNode.active = false;
        this.anim.getComponent("sp.Skeleton").setAnimation(0, "jin", false);

        this.anim.getComponent("sp.Skeleton").setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (animationName == "jin") {
                this.anim.getComponent("sp.Skeleton").setAnimation(0, "xuan", false);
            } else if (animationName == "xuan") {
                this.anim.getComponent("sp.Skeleton").setAnimation(0, "daiji", false);
                this.init(type, target);
                AudioHelp.playSimpleAudioEngine("chouzhongyingxiao", 0.7);
            } else if (animationName == "daiji") {
            } else if (animationName == "chu") {
                this.node.destroy();
            }
        });
    },

    setAnimFotChu: function () {
        this.needShowNode.active = false;
        this.anim.getComponent("sp.Skeleton").setAnimation(0, "chu", false);
    },

    init: function (type, target) {
        this.needShowNode.active = true;
        this.type = type;
        this.target = target;
        let content = "";
        this.moneyNode.active = false;
        this.houseNode.active = false;
        if (type == 0) {
            this.moneyNode.active = true;
            this.giftCount = BigNumber.mul(Utils.random(70, 30), (window.GameData.produce).toString());
            content = BigNumber.getShowString(this.giftCount);
            this.needShowNode.getChildByName("moneyNode").getChildByName("New Layout").getChildByName("gifttype").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("icon_house");
            this.img_gift.spriteFrame = this.baseImg_1.getSpriteFrame("img_jinbi");
            this.img_gift.node.scale = 0.5;
        } else if (type == 1) {
            this.moneyNode.active = true;
            this.giftCount = Math.floor(Utils.getBuyDiamond(window.GameData.level - 3) * 0.16);
            if(this.giftCount <= 40){
                this.giftCount = 40;
            }
            content = this.giftCount;
            this.needShowNode.getChildByName("moneyNode").getChildByName("New Layout").getChildByName("gifttype").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("icon_zuanshi");
            this.img_gift.spriteFrame = this.baseImg.getSpriteFrame("icon_diamonds");
            this.img_gift.node.scale = 1.1;
        } else {
            //最高等级-7到最高等级-5
            this.houseNode.active = true;
            this.giftCount = Utils.random(parseInt(window.GameData.level) - 5, parseInt(window.GameData.level) - 7);
            var data = JsonConfig.getRowWithKV("lv", this.giftCount, "HouseConfig");
            var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
            if (spriteFrame) {
                this.imghousedi.spriteFrame = spriteFrame;
            }
            var data1 = JsonConfig.getRowWithKV("lv", this.giftCount + 1 , "HouseConfig");
            var spriteFrame1 = LoadManager.getSpriteFrameWithKey(data1.image);
            if (spriteFrame1) {
                this.imghousegao.spriteFrame = spriteFrame1;
            }
            this.labeloldlv.string = this.giftCount;
            this.labelnewlv.string = this.giftCount + 1
            this.labelold.string = data.name;
            this.labelnew.string = data1.name;
        }
        this.showBtnSpr(type);
        this.labelContent.string = content;
        this.setShowCloseTime(type);
    },

    showBtnSpr: function (type) {
        if (type == 0) {
            this.btnVideoSpr.node.x = 0;
            this.btnVideomul.node.active = false;

            // modify by Jack
            // var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Gold_Chests)
            // var reward = window.GameData.getRewardSetting(window.RewardSetting.GoldChests);
            // var len = json.count;
            // if (json.count >= reward.length) {
            //     len = reward.length - 1;
            // }
            // if (reward && reward[len] == 1) {
            //     this.btnVideoSpr.spriteFrame = this.baseImg_1.getSpriteFrame(window.MessageBoxSpr.word_seex10);
            //     this.btnVideoSpr.node.scale = 0.8;
            // } else {
            //     this.btnVideoSpr.spriteFrame = this.baseImg_1.getSpriteFrame(window.MessageBoxSpr.Word_FanBei);
            // }
        }

        if (type == 1) {
            this.btnVideoSpr.node.x = 0;
            this.btnVideomul.node.active = false;
            // modify by Jack
            // this.btnVideoSpr.spriteFrame = this.baseImg_1.getSpriteFrame(window.MessageBoxSpr.SeeVideo);
            this.btnVideoSpr.node.scale = 0.8;
        }

        if (type == 2) {
            // modify by Jack
            // this.btnVideoSpr.spriteFrame = this.baseImg_1.getSpriteFrame(window.MessageBoxSpr.Share);
            // this.btnVideomul.spriteFrame = this.baseImg_1.getSpriteFrame(window.MessageBoxSpr.BlueLvAddOne);
        }
    },

    setShowCloseTime: function (type) {
        this.needShowNode.getChildByName("btnClose").active = false;
        var time = 0;

        // modify by Jack

        var lbl_node = cc.find('lbl', this.needShowNode.getChildByName("btnSee")).getComponent(cc.Label);
        if (type == 0) {
            lbl_node.string = '20钻石双倍';
        } 
        else if (type == 1) {
            lbl_node.string = '领取';
        }
        else if (type == 2) {
            lbl_node.string = '领取';
        }

        // if (type == 0) {
        //     var goldJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Gold_Chests);
        //     if (parseInt(goldJson.count) >= parseInt(goldJson.maxcount)) {
        //         this.needShowNode.getChildByName("btnSee").active = false;
        //         time = 0;
        //     } else {
        //         this.needShowNode.getChildByName("btnSee").active = true;
        //         time = window.ShowTime;
        //     }
        // }
        // if (type == 1) {
        //     time = window.ShowTime;
        // }
        // if (type == 2) {
        //     var houseJson = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Monster_Chests);
        //     if (parseInt(houseJson.count) >= parseInt(houseJson.maxcount)) {
        //         this.needShowNode.getChildByName("btnSee").active = false;
        //         time = 0;
        //     } else {
        //         this.needShowNode.getChildByName("btnSee").active = true;
        //         time = window.ShowTime;
        //     }
        // }

        this.scheduleOnce(function () {
            this.needShowNode.getChildByName("btnClose").active = true;
        }, time)
    },

    btnClickClose: function () {
        if (this.type == 2) {
            CallBackHelp.callFunc(window.CallBackMsg.CreateHouseForGift, [this.target, this.giftCount]);
            this.node.destroy();
        } else if (this.type == 0) {
            var giftCount = this.giftCount;
            if (parseInt(window.GameData.diamond) >= 20) {
                var diamond = parseInt(window.GameData.diamond) - 20;
                window.GameData.setDiamond(diamond);
                giftCount = 2 * this.giftCount;
            } else {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '钻石不足，正常领取金币'});
            }
            
            CallBackHelp.callFunc(window.CallBackMsg.ClickGift, this.target);
            window.GameData.setGold(BigNumber.add(window.GameData.gold, giftCount));
            Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(giftCount) + "金币", function () { }, function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
            this.setAnimFotChu();
        } else {
            CallBackHelp.callFunc(window.CallBackMsg.ClickGift, this.target);
            this.setAnimFotChu();
        }
        
    },

    btnClickSee: function () {
        // modify by Jack
        this.btnClickClose();
        return;
        let self = this;
        var giftItem = this.target;
        if (this.type == 0) {
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Gold_Chests)
            var isSure = parseInt(json.count) < parseInt(json.maxcount);
            if (isSure) {
                var reward = window.GameData.getRewardSetting(window.RewardSetting.GoldChests);
                var len = json.count;
                if (json.count >= reward.length) {
                    len = reward.length - 1;
                }
                if (reward && reward[len] == 1) {
                    self.showVideo(giftItem);
                } else {
                    self.shareFunc(giftItem);
                }
            } else {
                CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                Utils.showTips("今日分享领双倍金币次数已到限制");
            }
        } else if (this.type == 1) {
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Diamond_Chests);
            var isSure = parseInt(json.count) < parseInt(json.maxcount);
            if (isSure) {
                this.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = false;
                WXHelp.createVideo(window.BannerVedioId.CurrencyVideo, function () {
                    CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                    self.node.destroy();
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Diamond_Chests);
                    window.GameData.setDiamond(parseInt(window.GameData.diamond) + self.giftCount);
                    Utils.showMessageBox(false, true, "获得" + self.giftCount + "钻石", function () { },
                        function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                }, function () {
                    self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
                    self.shareDiamondFunc(giftItem);
                },function(){
                    self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
                });
            } else {
                CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                Utils.showTips("今日分享领双倍金币次数已到限制");
            }
        } else {
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Monster_Chests);
            var isSure = parseInt(json.count) < parseInt(json.maxcount);
            if (isSure) {
                this.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = false;
                WXHelp.shareAppMessageDiffGroup(function () {
                    window.curShareType = window.ShareOrSeeVideo.Monster_Chests;
                    self.timer = setInterval(function () {
                        if (window.SystemInfo.isSuccess != -1) {
                            clearInterval(self.timer);
                        }
                        if (window.SystemInfo.isSuccess == 1) {
                            window.SystemInfo.isSuccess = -1;
                            self.node.destroy();
                            window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Monster_Chests);
                            CallBackHelp.callFunc(window.CallBackMsg.CreateHouseForGift, [giftItem, self.giftCount + 1]);
                            Utils.showTips("分享成功");
                        } else if (window.SystemInfo.isSuccess == 0) {
                            window.SystemInfo.isSuccess = -1;
                            self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
                            WXHelp.showWXTips("提示",Utils.getShareFailCon());
                            
                        }
                    }, 800);
                });
            } else {
                CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                Utils.showTips("今日分享获得房子等级+1次数已到限制");
            }
        }
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

    shareFunc: function (giftItem) {
        let self = this;
        this.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Gold_Chests;
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    self.node.destroy();
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Gold_Chests);
                    CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                    var gold = BigNumber.mul(self.giftCount, "2");
                    window.GameData.setGold(BigNumber.add(window.GameData.gold, gold));
                    Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(gold) + "金币", function () { },
                        function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                } else if (window.SystemInfo.isSuccess == 0) {
                    window.SystemInfo.isSuccess = -1;
                    self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                }
            }, 800);
        });
    },

    shareDiamondFunc: function (giftItem) {
        let self = this;
        this.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.Diamond_Chests;
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
                    self.node.destroy();
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Diamond_Chests);
                    window.GameData.setDiamond(parseInt(window.GameData.diamond) + self.giftCount);
                    Utils.showMessageBox(false, true, "获得" + self.giftCount + "钻石", function () { },
                        function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, function () {
                            if (self.node) {
                                self.node.destroy();
                            }
                        }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                } else if (window.SystemInfo.isSuccess == 0) {
                    window.SystemInfo.isSuccess = -1;
                    self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                }
            }, 800);
        });
    },

    showVideo: function (giftItem) {
        let self = this;
        this.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = false;
        WXHelp.createVideo(window.BannerVedioId.CurrencyVideo, function () {
            window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.Gold_Chests);
            CallBackHelp.callFunc(window.CallBackMsg.ClickGift, giftItem);
            self.node.destroy();
            var gold = BigNumber.mul(self.giftCount, "10");
            window.GameData.setGold(BigNumber.add(window.GameData.gold, gold));
            Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(gold) + "金币", function () { },
                function () {
                    if (self.node) {
                        self.node.destroy();
                    }
                }, function () {
                    if (self.node) {
                        self.node.destroy();
                    }
                }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
        }, function () {
            self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
            self.shareFunc();
        },function(){
            self.needShowNode.getChildByName("btnSee").getComponent(cc.Button).interactable = true;
        });
    },
});
