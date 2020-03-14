let CallBackHelp = require("CallBackHelp");
let JsonConfig = require("JsonConfig");
let BigNumber = require("BigNumber");
let LoadManager = require("LoadManager");
let Utils = require("Utils");
let WXHelp = require("WXHelp");
let HttpHelp = require("HttpHelp");
let AudioHelp = require("AudioHelp");
let PanelManager = require("PanelManager");


cc.Class({
    extends: cc.Component,
    properties: {
        touchBack: cc.Node,
        redPoint: cc.Node,
        bgNode: cc.Node,
        imgwoman: cc.Node,
        labelCueName: cc.Label,
        labeltime: cc.Label,
    },

    initCallBack() {
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.TouchendHouse, function (param) {
            if (param) {
                self.moveEnd(param);
            }
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.TouchStartHouse, function (param) {
            if (param) {
                self.moveStart(param);
            }
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.MoveHouse, function (param) {
            if (param) {
                self.moveHouse(param);
            }
        }, this);

        let label_produce = this.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("label_produce");
        label_produce.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.produce) + "/S";
        CallBackHelp.addCall(window.CallBackMsg.ChangeProduce, function (param) {
            label_produce.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.produce) + "/S";
        }, this);

        let label_gold = this.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("label_gold");
        label_gold.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.gold);
        CallBackHelp.addCall(window.CallBackMsg.ChangeGold, function (param) {
            label_gold.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.gold);
        }, this);

        let label_times = this.node.getChildByName("ui_down").getChildByName("btn_timesTick").getChildByName("label_time");
        let changeTimesTick = function () {
            if (window.GameData.timesTick > 0) {
                label_times.getComponent(cc.Label).string = Utils.getSecondsTickString(window.GameData.timesTick);
                self.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("word_speedx2").active = true;
                self.showEffect();
            }else {
                label_times.getComponent(cc.Label).string = "";
                self.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("word_speedx2").active = false;
                self.desEffect();
            }
        }
        changeTimesTick();

        CallBackHelp.addCall(window.CallBackMsg.CheckNewDay, function (param) {
            self.checkNewDay();
            for (var i = 0; i < 3; i++) {
                self.checkGiftTime(i);
            }
            self.changeGiftTime();
            self.checkGoldOwnerTime();
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeTimesTick, function (param) {
            changeTimesTick();
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeGiftTime, function (param) {
            self.changeGiftTime();
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeOwnerChatTime, function (param) {
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.OwnerChat);
            if (json && parseInt(json.count) < parseInt(json.maxcount)) {
                self.showOwnerChat();
            }else{
                self.setOwnerChatHide();
            }
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.BuyHouse, function (param) {
            self.buyHouse(param);
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.BuyHouseByDiamond, function (param) {
            self.buyHouseByDiamond(param);
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.CreateHouse, function (param) {
            self.createHouse(param);
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeLevel, function (param) {
            self.changeLabelName();
            self.changeCreateHouse();
            self.initGiftTime();
            self.playSoundTolevelUp();
            self.showMap();
            self.showSomeBtnForLv();
            self.showGuideForLv();
            self.showNotMessage(0.5);
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeBuyCount, function (param) {
            self.changeCreateHouse();
        }, this);
        this.changeCreateHouse();

        CallBackHelp.addCall(window.CallBackMsg.ClickGift, function (param) {
            if (param) {
                self.removeGift(param);
            }
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.ChangeDrakRewardCount, function (param) {
            self.addDrakReward(param);
        }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeShare, function (param) {
            self.showMap();
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.CreateHouseForGift, function (param) {
            self.createHouseInBlock(param[1], param[0].standBlock);
        }, this);

        // CallBackHelp.addCall(window.CallBackMsg.CreateHouseForVideo, function (param) {
        //     var block = self.chooseFreeBlock();
        //     if (block != null) {
        //         self.createHouse(param);
        //         window.GameData.setShareNumToday(window.ShareOrSeeVideo.Store_Video_Monster);
        //         WXHelp.addShare(window.ShareOrSeeVideo.Store_Video_Monster);
        //     }
        // }, this);

        CallBackHelp.addCall(window.CallBackMsg.ChangeCurSginTime, function (param) {
            self.checkTodaySginToShowPoint();
        }, this);
        CallBackHelp.addCall(window.CallBackMsg.CreateHouseToOutLine, function (param) {
            var block = self.chooseFreeBlock();
            if (block != null) {
                self.createHouse(param);
            }
        }, this);

        window.SystemInfo.refreshServerTime();
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("游戏进入后台");
            window.SystemInfo.setStartTime();
            // self.setPlaneHide();
            window.ServerStorage.saveServerStorage();
            window.SystemInfo.setServerTime(0);
            self.clearTimeLoop();
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("重新返回游戏");
            window.SystemInfo.setEndTime();
            // self.setPlaneShow();
            window.SystemInfo.refreshServerTime();
            self.setTimeLoop();
        }, this);
    },

    playSoundTolevelUp: function () {
        if (window.GameData.level == 4 || window.GameData.level == 10 || window.GameData.level == 18 || window.GameData.level == 28) {
            AudioHelp.playSimpleAudioEngine("openmap", 0.7);
        }
    },

    showEffect: function () {
        if (!this.isRunAction) {
            let node = this.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("word_speedx2");
            var action = cc.repeatForever(cc.sequence(
                cc.scaleTo(0.5, 2),
                cc.scaleTo(0.5, 1),
                cc.delayTime(1.2)
            ));
            node.runAction(action);
            this.isRunAction = true;
        }
    },

    desEffect: function () {
        let node = this.node.getChildByName("ui_top").getChildByName("bg_money").getChildByName("word_speedx2");
        node.stopAllActions();
        this.isRunAction = false;
    },

    addDrakReward: function (type) {
        let curTime = window.SystemInfo.getServerTime();
        curTime = Math.floor(curTime / 1000);
        var isToday = Utils.judgeTime(window.GameData.saveTime, curTime);
        var count = window.GameData.getDrakReward(type);
        if (!isToday) {
            count = 0;
        }
        if (count < 10) {
            window.GameData.setDiamond(parseInt(window.GameData.diamond) + 10);
            Utils.showTips("获得" + 10 + "钻石");
        }
    },

    checkNewDay: function () {
        let serverTime = window.SystemInfo.getServerTime();
        let signTime = window.GameData.getSignTime();
        if (serverTime - signTime > 24 * 60 * 60 * 1000 * 3) {
            window.GameData.clearSignData();
        }
        this.checkTodaySginToShowPoint();
    },

    initBtn: function () {
        this.node.getChildByName("ui_down").getChildByName("btn_timesTick").active = false;
        this.node.getChildByName("ui_down").getChildByName("btn_shop").active = false;
        this.node.getChildByName("ui_top").getChildByName("button").active = false;
        this.node.getChildByName("ui_top").getChildByName("btn_rank").active = false;
        this.node.getChildByName("ui_down").getChildByName("btn_buyHouse").active = false;
    },

    showNotMessage: function (time) {
        let self = this;
        this.scheduleOnce(function () {
            var data = JsonConfig.getRowWithKV("lv", window.GameData.level, "HouseConfig");
            var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
            AudioHelp.playSimpleAudioEngine("houselevelup", 0.7);
            // window.GameData.setDiamond(window.GameData.diamond + parseInt(window.GameData.level) * 5);
            // Utils.showMessageBox(false, true, "奖励升级" + parseInt(window.GameData.level) * 5 + "钻石", function () { },
            //     function () {
            //         if (window.GameData.level % 5 == 0) {
            //             self.initGameBg();
            //         }
            //     }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);

            if (window.GameData.level > 10 && window.GameData.level % 3 == 0) {
                Utils.showMessageBox(false, false, "恭喜，获得" + data.name + "(" + window.GameData.level + "级)啦", function () { }, function () {
                    // WXHelp.shareGroup();
                }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk, spriteFrame);
            } 
            else {
                Utils.showMessageBox(false, false, "恭喜，获得" + data.name + "(" + window.GameData.level + "级)啦", function () { }, function () {
                }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk, spriteFrame);
            }
        }, time);
    },

    showSomeBtnForLv: function () {
        if (window.GameData.level >= window.OpenLevel.PaiHangPang) {
            this.node.getChildByName("ui_down").getChildByName("btn_buyHouse").active = true;
            // this.node.getChildByName("ui_top").getChildByName("btn_rank").active = true;
            // this.node.getChildByName("ui_down").getChildByName("btn_timesTick").active = true;
        }
        if (window.GameData.level >= window.OpenLevel.ShangDian) {//开放商店
            this.node.getChildByName("ui_down").getChildByName("btn_shop").active = true;
        }
        if (window.GameData.level >= window.OpenLevel.YaoQing) {//开放邀请
            // this.node.getChildByName("ui_top").getChildByName("button").active = true;
        }
    },

    showGuideForLv: function () {
        if (window.GameData.level == 2) {
            CallBackHelp.callFunc(window.CallBackMsg.DestroyGuide, window.GameData.leve);
        }
        if (window.GameData.level == 3) {
            let component = PanelManager.openPanel(window.PrefabType.Guide);
            component.init(window.GameData.level, this.node.getChildByName("ui_down").getChildByName("btn_buyHouse"));
        }
    },

    showMap: function () {
        var maxlen = Utils.getShowMapLen();
        this.chanageMapScalePos(maxlen);
        if (this.curMapCount == maxlen) {
            return;
        }
        var o = null;
        let GameBlocks = this.node.getChildByName("GameBlocks");
        for (var i = this.curMapCount; i < maxlen; i++) {
            o = JsonConfig.loadItems.BlockConfig[i];
            var component = PanelManager.getItem(window.PrefabType.MapBlock, GameBlocks);
            var block = component.node;
            block.x = o.posX;
            block.y = o.posY;
            block.zIndex = o.ZOrder;
            var component = block.getComponent("MapBlock");
            component.setData(o);
            this.BlockArray.push(component);
        }
        this.curMapCount = maxlen;
    },

    chanageMapScalePos: function (len) {
        let GameBlocks = this.node.getChildByName("GameBlocks");
        let GameHouses = this.node.getChildByName("GameHouses");
        let GameGift = this.node.getChildByName("GameGift");
        let scale = 1;
        let posY = 0;
        if (window.IsPhoneType == "pad") {
            scale = 0.6;
            posY = 20;
            if (len == 12) {
                scale = 0.8;
                posY = 120;
            }
        } else {
            scale = 1;
            posY = 0;
            if (len == 12) {
                scale = 1;
                posY = 180;
            } else {
                scale = 1;
                posY = 180;
            }
        }
        GameBlocks.scale = scale;
        GameBlocks.y = posY;
        GameHouses.scale = scale;
        GameHouses.y = posY;
        GameGift.scale = scale;
        GameGift.y = posY;
    },

    initGame() {
        this.BlockArray = new Array();
        this.HouseArray = new Array();
        this.GiftArray = new Array();
        this.WillGiftArray = new Array();

        var i = 0;
        var o = null;
        let GameBlocks = this.node.getChildByName("GameBlocks");
        var len = Utils.getShowMapLen();
        this.chanageMapScalePos(len);
        this.curMapCount = len;
        for (i = 0; i < len; i++) {
            o = JsonConfig.loadItems.BlockConfig[i];
            var component = PanelManager.getItem(window.PrefabType.MapBlock, GameBlocks);
            var block = component.node;
            block.x = o.posX;
            block.y = o.posY;
            block.zIndex = o.ZOrder;
            component.setData(o);
            this.BlockArray.push(component);

            let Housedata = window.GameData.getHouseInSaveBlock(o.id);
            if (Housedata) {
                this.createHouseInBlock(Housedata.house_lv, component, Housedata.isfeng);
            }

            let giftData = window.GameData.getGiftInSaveBlock(o.id);
            if (giftData) {
                this.createGiftInBlock(giftData.gift_type, component);
            }
        }

        // this.setPlaneShow();
    },

    setPlaneShow: function () {
        if (window.GameData.level < 10) {
            return;
        }
        let self = this;
        let plane = this.node.getChildByName("Plane");
        this.planAnim = setInterval(function () {
            let arr = self.getMaxLevelBlock();
            plane.active = true;
            plane.x = -400;
            plane.y = 50;
            plane.getComponent("Plane").init(arr);
        }, 90000);
    },

    setPlaneHide: function () {
        let plane = this.node.getChildByName("Plane");
        if (this.planAnim) {
            plane.active = false;
            clearInterval(this.planAnim);
        }
    },

    //查找最高等级
    getMaxLevelBlock: function () {
        if (this.HouseArray.length == 0) {
            return null;
        }
        var houseData = this.HouseArray[0];
        for (var i = 0; i < this.HouseArray.length; i++) {
            if (this.HouseArray[i].fengSpine.active) {
                return null;
            }
            if (houseData.houseData.lv < this.HouseArray[i].houseData.lv) {
                houseData = this.HouseArray[i];
            }
        }
        if (houseData.fengSpine.active == false) {
            return houseData;
        } else {
            return null;
        }
    },

    checkTodaySginToShowPoint: function () {
        let serverTime = window.SystemInfo.getServerTime();
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

        let yester_sign = window.GameData.getSignData(sub_yesterday);
        let today_sign = window.GameData.getSignData(sub_today);

        if (yester_sign > 0 && today_sign > 0) {
            this.redPoint.active = false;
        } else {
            this.redPoint.active = true;
        }
    },

    start() {
        cc.game.setFrameRate(40);
        if (window.SystemInfo.isLoaded == false) {
            cc.director.loadScene('MainScene');
            return
        }
        let self = this;
        window.WinSizeRefresh(this.node);
        window.GameData.initStorage();

        this.initCallBack();
        this.initGameBg();
        this.initGame();
        this.initBtn();
        this.showSomeBtnForLv();
        this.setDataToWX();
        this.backGroundClick();
        this.judgeIsFirst();
        this.changeLabelName();

        if (window.GameData.level >= window.OpenLevel.BaoZuPo) {
            window.GameData.setOwnerchattime(Utils.random(50, 30));
        }

        this.schedule(function () {
            if (window.SystemInfo.getServerTime() > 0) {
                self.minutesUpdate();
            }
        }, 1);

        //掉落房子  10级以后就不会再掉落了
        if (window.GameData.level < 10) {
            this.schedule(function () {
                if (window.SystemInfo.getServerTime() > 0) {
                    self.randomCreatorForTime();
                }
            }, 30);
        }

        this.schedule(function () {
            if (window.SystemInfo.getServerTime() > 0) {
                self.storageUpdate();
            }
        }, 10);

        this.setTimeLoop();
        // this.setBanner();
    },

    setBanner: function () {
        this.banner = require("WXHelp").createBanner(window.BannerVedioId.MainBanner);
        this.schedule(function () {
            if (window.GameData.isSeeVideo == false && window.GameData.getBannerCount() < 10) {
                this.banner.destroy();
                this.banner = require("WXHelp").createBanner(window.BannerVedioId.MainBanner);
            }
        }.bind(this), 30);
    },

    clearTimeLoop: function () {
        this.unschedule(this.showHouseMoney1);
        this.unschedule(this.showHouseMoney2);
        this.unschedule(this.showHouseMoney3);
        this.unschedule(this.showHouseMoney4);
    },

    setTimeLoop: function () {
        this.schedule(this.showHouseMoney1, 1);
        this.schedule(this.showHouseMoney2, 1.5);
        this.schedule(this.showHouseMoney3, 2);
        this.schedule(this.showHouseMoney4, 2.5);
    },

    changeLabelName: function () {
        let data = JsonConfig.getRowWithKV("lv", window.GameData.level, "HouseConfig");
        this.labelCueName.string = data.name + "\nLv." + window.GameData.level;
        if (window.GameData.level == window.OpenLevel.BaoZuPo) {
            window.GameData.setOwnerchattime(Utils.random(50, 30));
        }
    },

    initGameBg: function () {
        let bgUp = this.bgNode.getChildByName("bgup").getComponent("sp.Skeleton");
        let data = JsonConfig.getRowWithKV("lv", window.GameData.level, "HouseConfig");
        if (data.upspine) {
            bgUp.timeScale = 1;
            bgUp.setAnimation(0, data.upspine, false);
            bgUp.getComponent("sp.Skeleton").setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if (animationName.substring(0, 1) == "s") {
                    if (data.bgup) {
                        bgUp.timeScale = 0.1;
                        bgUp.setAnimation(0, data.bgup, true);
                    }
                }
            });
        } else {
            if (data.bgup) {
                bgUp.timeScale = 0.1;
                bgUp.setAnimation(0, data.bgup, true);
            }
        }
    },

    randomCreatorForTime: function () {
        //每30秒出现一个房子
        if (window.GameData.level < 10) {
            this.createHouse(1); //window.GameData.dropHouse
        }
    },

    /**
     * 是否第一次登录
     */
    judgeIsFirst: function () {
        if (window.SystemInfo.storageVersion < 10) {
            if (window.GameData.saveTime == "0" || window.GameData.saveTime == "") {  //第一次登录
                var component = PanelManager.openPanel(window.PrefabType.Guide);
                component.init(window.GameData.level);
            }
        }
    },

    storageUpdate: function () {
        //保存到服务器
        window.ServerStorage.saveServerStorage();
    },

    minutesUpdate: function () {
        var i = 0;
        var o;
        var produce = "0";
        let HouseSaveArray = new Array();
        for (i = 0; i < this.HouseArray.length; i++) {
            o = this.HouseArray[i];
            produce = BigNumber.add(produce, o.getProduce(false).toString());
            HouseSaveArray.push(o.getSaveData());
        }
        window.GameData.setProduce(produce);

        let giftSaveArray = new Array();
        for (var j = 0; j < this.GiftArray.length; j++) {
            giftSaveArray.push(this.GiftArray[j].getSaveData());
        }
        //倍数
        if (window.GameData.timesTick > 0) {
            produce = BigNumber.mul(produce, "2");
            window.GameData.subTimesTick(1);
        }

        if (window.GameData.giftTime.length > 0) {
            window.GameData.subGiftTime(1); //礼盒时间
        }
        this.createGiftForArray();

        if (parseInt(window.GameData.ownerchattime) > 0 && window.GameData.level >= window.OpenLevel.BaoZuPo) {
            window.GameData.subOwnerchattime(1); //聊天互动
        }

        //设置内存数据
        window.GameData.setGold(BigNumber.add(produce, window.GameData.gold));
        //保存数据到本地
        window.GameData.setHouseSave(HouseSaveArray);
        window.GameData.setGiftSave(giftSaveArray);
        window.GameData.saveStorage();
        window.GameData.checkOutLineGold(this);
    },

    setDataToWX: function () {
        let dataHouse = JsonConfig.getRowWithKV("lv", window.GameData.level, "HouseConfig");
        var data = { value: "" + window.GameData.produce, sex: "" + WXData.userInfo.gender, city: "Lv." + window.GameData.level + dataHouse.name };
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            window.wx.setUserCloudStorage({
                KVDataList: [{ key: "userGameRank", value: JSON.stringify(data) }],
                success: function (res) {
                    console.log('setUserCloudStorage', 'success', res)
                },
                fail: function (res) {
                    console.log('setUserCloudStorage', 'fail')
                },
                complete: function (res) {
                    console.log('setUserCloudStorage', 'ok')
                }
            });
        }
    },

    createGiftForArray: function () {
        for (var i = 0; i < this.WillGiftArray.length; i++) {
            var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.Diamond_Chests);
            // if (parseInt(json.count) >= parseInt(json.maxcount) && this.WillGiftArray[i] == 1) {
            //     this.WillGiftArray.splice(i, 1);
            //     continue;
            // }
            // var gift = this.createGift(this.WillGiftArray[i]);
            // if (gift) {
            //     window.GameData.addGetCount(this.WillGiftArray[i]);
            //     this.checkGiftTime(this.WillGiftArray[i]);
            //     this.WillGiftArray.splice(i, 1);
            // }
        }
    },

    changeGiftTime: function () {
        if (window.GameData.giftTime.length == 0) {
            this.initGiftTime();
        } else {
            for (var i = 0; i < window.GameData.giftTime.length; i++) {
                var time = window.GameData.giftTime[i];
                if (time <= 0) {
                    if (i == 1 && this.getGiftCount(i) >= 3) {//超出3次
                    } else {
                        if (this.WillGiftArray.length == 0) {
                            this.WillGiftArray.push(i);
                        } else {
                            if (this.WillGiftArray.indexOf(i) == -1) {
                                this.WillGiftArray.push(i);
                            }
                        }
                    }
                }
            }
        }
    },

    initGiftTime: function () {
        if (window.GameData.level >= window.OpenLevel.JinBiBaoXiang) {
            if (!window.GameData.giftTime[0] && window.GameData.giftTime[0] != 0) {
                window.GameData.setGiftTime(0, 20);
            }
        }
        if (window.GameData.level >= window.OpenLevel.ZuanShiBaoXiang) {
            if (!window.GameData.giftTime[1] && window.GameData.giftTime[1] != 0) {
                window.GameData.setGiftTime(1, 90);
            }
        }
        if (window.GameData.level >= window.OpenLevel.FangZiBaoXiang) {
            if (!window.GameData.giftTime[2] && window.GameData.giftTime[2] != 0) {
                window.GameData.setGiftTime(2, 60);
            }
        }
    },

    checkGiftTime: function (type) {
        if (type == 0 && window.GameData.level >= window.OpenLevel.JinBiBaoXiang) {
            var count = this.getGiftCount(0);
            var time = 20;
            if (count > 0) {
                time = time * Math.pow(1.5, count);
            }
            window.GameData.setGiftTime(0, time);
        } else if (type == 1 && window.GameData.level >= window.OpenLevel.ZuanShiBaoXiang) {
            var time = 90;
            window.GameData.setGiftTime(1, time);
        } else if (type == 2 && window.GameData.level >= window.OpenLevel.FangZiBaoXiang) {
            var count = this.getGiftCount(2);
            var time = 60;
            if (count > 0) {
                time = time * Math.pow(2, count);
            }
            window.GameData.setGiftTime(2, time);
        }
    },

    getGiftCount: function (type) {
        let curTime = window.SystemInfo.getServerTime();
        curTime = Math.floor(curTime / 1000);
        var isToday = Utils.judgeTime(window.GameData.saveTime, curTime);
        if (isToday) {
            return window.GameData.getGetCount(type);
        } else {
            var curGetCount = window.GameData.curGetCount;
            curGetCount.splice(0, curGetCount.length);
            return 0;
        }
    },

    checkGoldOwnerTime: function () {
        let curTime = window.SystemInfo.getServerTime();
        curTime = Math.floor(curTime / 1000);
        var isToday = Utils.judgeTime(window.GameData.saveTime, curTime);
        if (!isToday) {
            window.GameData.setOwnerchattime(Utils.random(50, 30));
            window.GameData.cleanBannerCount();
        }
    },

    chooseFreeBlock: function () {
        var i = 0;
        var o = null;
        for (i = 0; i < this.BlockArray.length; i++) {
            o = this.BlockArray[i];
            if (o.getIsLock()) {
                continue;
            }
            if (o.standHouse == null) {
                return o;
            }
        }
        return null;
    },

    chooseNearBlock: function (House) {
        var i = 0;
        var o = null;
        var minBlock = null;
        var minDistance = -1;
        var distance;
        var distance_x;
        var distance_y;
        for (i = 0; i < this.BlockArray.length; i++) {
            o = this.BlockArray[i];
            if (o.getIsLock()) {
                continue;
            }
            if (o.standHouse) {
                if (o.standHouse.houseData == undefined) {
                    continue;
                }
            }
            distance_x = o.node.x - House.node.x;
            distance_y = o.node.y - House.node.y;
            distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y);
            if (distance < minDistance || minDistance == -1) {
                minDistance = distance;
                minBlock = o;
            }
        }
        if (minDistance < 65) {  //TODO
            return minBlock;
        }
        else {
            return null;
        }
    },

    changeBlock: function (House, block, action) {
        if (House && block) {
            var perStandBlock = null;
            if (House.standBlock) {
                perStandBlock = House.standBlock;
            }
            var perStandHouse = null;
            if (block.standHouse) {
                perStandHouse = block.standHouse;
            }
            if (perStandHouse && perStandHouse.node.name == "GiftItem") {
                this.removeGift(perStandHouse);
                perStandHouse = null;
            }
            if (!perStandBlock && perStandHouse) {
                return false;
            }
            else {
                House.setStandBlock(block, action);
                block.setStandHouse(House, action);
                if (perStandBlock) {
                    perStandBlock.setStandHouse(perStandHouse);
                }
                if (perStandHouse) {
                    perStandHouse.setStandBlock(perStandBlock);
                }
            }
            return true;
        }
    },

    moveStart: function (house) {
        if (!house.fengSpine.active) {
            this.sameArr = this.returnSameHouse(house);
            if (this.sameArr.length == 0) {
                for (var i = 0; i < this.HouseArray.length; i++) {
                    if (!this.HouseArray[i].standBlock.img_autoTip.node.active) {
                        this.HouseArray[i].node.getChildByName("img_house").color = cc.color(207, 207, 207);
                    }
                }
            } else {
                for (var j = 0; j < this.sameArr.length; j++) {
                    for (var i = 0; i < this.HouseArray.length; i++) {
                        if (this.HouseArray[i].standBlock.blockData.id == this.sameArr[j].standBlock.blockData.id) {
                            this.HouseArray[i].node.getChildByName("img_house").color = cc.color(255, 255, 255);
                            this.HouseArray[i].standBlock.showAutoTip();
                        } else {
                            if (!this.HouseArray[i].standBlock.img_autoTip.node.active) {
                                this.HouseArray[i].node.getChildByName("img_house").color = cc.color(207, 207, 207);
                            }
                        }
                    }
                }
            }
        }
    },

    moveHouse: function (house) {
        this.oldBlock = this.block;
        this.block = this.chooseNearBlock(house);
        if (this.oldBlock) {
            Utils.setMapOnClickHouse(false, this.oldBlock);
        }
        if (this.block) {
            Utils.setMapOnClickHouse(true, this.block);
        }
        if (this.block && this.oldBlock != this.block) {
            Utils.setMapOnClickHouse(true, this.block);
        }
    },

    moveEndToSell: function (House) {
        let self = this;
        let btn_sell = this.node.getChildByName("ui_down2").getChildByName("btn_sell");
        let housePos = House.node.convertToWorldSpace(cc.v2(0, 0));
        let btnPos = btn_sell.convertToWorldSpace(cc.v2(0, 0));
        if ((housePos.x <= btnPos.x + (btn_sell.width / 2)) && (housePos.x >= btnPos.x - (btn_sell.width / 2))
            && (housePos.y <= btnPos.y + (btn_sell.height / 2)) && (housePos.y >= btnPos.y - (btn_sell.height / 2))) {
            Utils.showMessageBox(false, false, "是否删除此房子？", function () {
                window.GameData.setGold(BigNumber.add(House.getSellCost(), window.GameData.gold));
                Utils.showTips("获得" + BigNumber.getShowString(House.getSellCost() + "") + "金币");
                self.removeHouse(House);
            }, function () { }, function () { }, window.MessageBoxSpr.RedDelete, window.MessageBoxSpr.YellowCancel);
            return true;
        }
        return false;
    },

    moveEnd: function (House) {
        this.curShowManage();
        if (House.fengSpine.active) {
            return;
        }
        for (var i = 0; i < this.HouseArray.length; i++) {
            this.HouseArray[i].node.getChildByName("img_house").color = cc.color(255, 255, 255);
            this.HouseArray[i].standBlock.hideAutoTip();
        }
        if (this.moveEndToSell(House) == true) {
            House.setStandBlock(House.standBlock);
            return;
        }
        var block = this.chooseNearBlock(House);
        if (block) {
            Utils.setMapOnClickHouse(false, block);
            this.moveCount = 0;
            this.isBack = false;
            if (block.standHouse && !block.standHouse.fengSpine.active) {
                if (block.standHouse == House) {
                    //还原
                    House.setStandBlock(House.standBlock);
                }
                else if (block.standHouse.houseData.lv == House.houseData.lv) {
                    //升级
                    if (block.standHouse.levelUp()) {
                        this.removeHouse(House);
                    }
                    else {
                        //换位
                        this.changeBlock(House, block, 1);
                    }
                }
                else {
                    //换位
                    this.changeBlock(House, block, 1);
                }
            }
            else {
                //换位
                this.changeBlock(House, block, 1);
            }
        } else {
            //还原
            House.setStandBlock(House.standBlock);
        }
    },

    removeHouse: function (House) {
        House.standBlock.setStandHouse(null);
        var i = 0;
        var o;
        for (i = 0; i < this.HouseArray.length; i++) {
            o = this.HouseArray[i];
            if (o == House) {
                this.HouseArray.splice(i, 1);
                House.node.destroy();
                return;
            }
        }
    },

    removeGift: function (gift) {
        gift.standBlock.setStandHouse(null);
        var i = 0;
        var o;
        for (i = 0; i < this.GiftArray.length; i++) {
            o = this.GiftArray[i];
            if (o == gift) {
                this.GiftArray.splice(i, 1);
                gift.node.destroy();
                return;
            }
        }
    },

    buyHouse: function (lv) {
        var block = this.chooseFreeBlock();
        if (block == null) {
            Utils.showTips("没有空位了，快去升级你的房子吧!");
            return null;
        }
        let buyCost = this.getBuyCost(lv);
        let leftGold = BigNumber.sub(window.GameData.gold, buyCost);
        if (leftGold == false) {
            // this.showGoldTip(buyCost);
            Utils.showTips("金币不足...");
            return null;
        }
        let House = this.createHouse(lv);
        if (House != null) {
            window.GameData.setGold(leftGold);
            window.GameData.addBuyCount(lv);
            AudioHelp.playSimpleAudioEngine("buyhouse", 0.7);
        }
        else {
            Utils.showTips("创建房子失败")
        }
    },

    quickBuyHouse: function (lv) {
        var block = this.chooseFreeBlock();
        if (block == null) {
            Utils.showTips("没有空位了，快去升级你的房子吧!");
            return null;
        }
        let buyCost = this.getBuyCost(lv);
        let leftGold = BigNumber.sub(window.GameData.gold, buyCost);
        if (leftGold == false) {
            // this.showGoldTip(buyCost)
            Utils.showTips("金币不足...");
            return null;
        }
        let isUP = false;
        // if (window.GameData.level >= window.OpenLevel.ZhuangXiuJinJie) {
        //     isUP = Utils.randomDraw([0, 1], [0.97, 0.03]);
        // }
        if (isUP) {
            let compont = PanelManager.openPanel(window.PrefabType.Decoration);
            compont.init(leftGold, lv, this);
        } else {
            let House = this.createHouse(lv);
            if (House != null) {
                window.GameData.setGold(leftGold);
                window.GameData.addBuyCount(lv);
                AudioHelp.playSimpleAudioEngine("buyhouse", 0.7);
            }
            else {
                Utils.showTips("创建房子失败")
            }
        }
    },

    buyHouseByDiamond: function (lv, btn) {
        var block = this.chooseFreeBlock();
        if (block == null) {
            Utils.showTips("没有空位了，快去升级你的房子吧!");
            return null;
        }
        let buyDiamond = this.getBuyDiamond(lv);
        let leftDiamond = parseInt(window.GameData.diamond) - buyDiamond;
        if (leftDiamond < 0) {
            Utils.showTips("钻石不够哦...")
            return null;
        }
        let House = this.createHouse(lv);
        if (House != null) {
            window.GameData.setDiamond(leftDiamond);
            window.GameData.addBuyCount(lv);
            AudioHelp.playSimpleAudioEngine("buyhouse", 0.7);
        }
        else {
            Utils.showTips("创建房子失败")
        }
    },

    getBuyCost: function (lv) {
        let count = window.GameData.getBuyCount(lv);
        let data = JsonConfig.getRowWithKV("lv", lv, "HouseConfig");
        let gold = data.cost.toString();

        let del = 0;
        for (let i = 0; i < count; i++) {
            gold = BigNumber.mul(gold, "108");
            del += 2;
        }
        gold = gold.substring(0, gold.length - del);
        return gold;
    },

    getBuyDiamond: function (lv) {
        let count = window.GameData.getBuyCount(lv);
        let data = JsonConfig.getRowWithKV("lv", lv, "HouseConfig");
        let diamond = data.diamond;
        for (let i = 0; i < count; i++) {
            diamond *= 1.2;
        }
        return Math.floor(diamond);
    },

    createHouse: function (lv) {
        var block = this.chooseFreeBlock();
        if (block == null) {
            Utils.showTips("没有空位了，快去升级你的房子吧!");
            return null;
        }
        AudioHelp.playSimpleAudioEngine("dropthing", 0.6);
        var component = this.createHouseInBlock(lv, block);
        return component;
    },

    createHouseInBlock: function (lv, block, isfeng) {
        var data = JsonConfig.getRowWithKV("lv", lv, "HouseConfig");
        if (!data) {
            return null;
        }
        let GameHouses = this.node.getChildByName("GameHouses");
        var component = PanelManager.getItem(window.PrefabType.HouseItem, GameHouses);
        component.setData(data);
        if (isfeng) {
            component.setFengSpine(2);
        }
        this.changeBlock(component, block, 0);
        this.HouseArray.push(component);
        return component;
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

    onDestroy() {
        if (this.banner) {
            this.banner.destroy();
        }
    },

    changeCreateHouse: function () {
        let ui_down = this.node.getChildByName("ui_down")
        let btn_buyHouse = ui_down.getChildByName("btn_buyHouse");
        let node_unlock = btn_buyHouse.getChildByName("node_unlock");

        let buylevel = window.GameData.level - 4;
        if (window.GameData.level != 6 && window.GameData.level != 5 && buylevel > 0) {
            buylevel = this.getBuyHouse(buylevel);
        }
        switch (window.GameData.level) {
            case 1:
            case 2:
            case 3:
            case 4:
                buylevel = 1;
                break;
            case 5:
            case 6:
                buylevel = 2;
                break;
            default:
                break;
        }
        if (buylevel <= 0) {
            node_unlock.active = false;
        } else {
            btn_buyHouse._lv = buylevel;
            node_unlock.active = true;
            let sprite_head = node_unlock.getChildByName("sprite_head");
            let label_needGold = node_unlock.getChildByName("label_needGold");
            let label_level = node_unlock.getChildByName("label_level");

            var data = JsonConfig.getRowWithKV("lv", buylevel, "HouseConfig");
            var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
            if (spriteFrame) {
                sprite_head.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
            label_needGold.getComponent(cc.Label).string = "" + BigNumber.getShowString(this.getBuyCost(buylevel));
            label_level.getComponent(cc.Label).string = buylevel + "级";
        }
    },

    createGift: function (type) {
        var block = this.chooseFreeBlock();
        if (block == null) {
            return null;
        }
        var component = this.createGiftInBlock(type, block);
        return component;
    },

    createGiftInBlock: function (type, block) {
        let GameGift = this.node.getChildByName("GameGift");
        var component = PanelManager.getItem(window.PrefabType.GiftItem, GameGift);
        component.setData(type);
        this.changeBlock(component, block, 0);
        this.GiftArray.push(component);
        return component;
    },

    btnClickCreateHouse: function () {
        this.curShowManage();
        CallBackHelp.callFunc(window.CallBackMsg.DestroyGuide, window.GameData.leve);
        var btn_buyHouse = this.node.getChildByName("ui_down").getChildByName("btn_buyHouse");
        let buylevel = btn_buyHouse._lv;
        switch (window.GameData.level) {
            case 1:
            case 2:
            case 3:
            case 4:
                buylevel = 1;
                break;
            case 5:
            case 6:
                buylevel = 2;
                break;
            default:
                break;
        }
        if (buylevel <= 0) {
            Utils.showTips("暂未解锁");
        }
        else {
            this.quickBuyHouse(buylevel);
        }
    },

    btnClickTimesTick: function () {
        if (window.GameData.timesTick > 0) {
            Utils.showTips("已经在加倍中了……");
        } else {
            PanelManager.openPanel(window.PrefabType.jiasuPanel);
        }
    },

    backGroundClick: function () {
        this.touchBack.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.curShowManage();
            if (window.GameData.share <= 6 && (window.GameData.isHaveLongClick == 0 || window.GameData.isHaveLongClick == "0")) {
                return;
            }
            this.touchBack.clickLongTime = setTimeout(() => {
                this.oneKeyAddHouse();
            }, 500);
        }, this);
        this.touchBack.on(cc.Node.EventType.TOUCH_END, function (event) {
            clearTimeout(this.touchBack.clickLongTime);
        }, this);
        this.touchBack.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
        }, this);
        this.touchBack.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        }, this);
    },

    curShowManage: function () {
    },

    btnClickShop: function () {
        this.curShowManage();
        // this.banner.hide();
        window.GameData.isSeeVideo = true;
        // PanelManager.openPanel(window.PrefabType.ShopPanel);
        unit.DialogMgr.showDialog(unit.DialogID.dialog_shop);
    },

    btnClickPlayer: function () {
        this.curShowManage();
        PanelManager.openPanel(window.PrefabType.PlayerPanel);
    },

    btnClickRankingList: function () {
        this.curShowManage();
        this.setDataToWX();
        // this.banner.hide();
        window.GameData.isSeeVideo = true;
        PanelManager.openPanel(window.PrefabType.RankPanel);
    },

    btnClickQiandao: function () {
        this.node.getChildByName("ui_top").getChildByName("btn_qiandao").getComponent(cc.Button).interactable = false;
        this.curShowManage();
        if (window.SystemInfo.getServerTime() > 0) {
            PanelManager.openPanel(window.PrefabType.SignNode);
            this.node.getChildByName("ui_top").getChildByName("btn_qiandao").getComponent(cc.Button).interactable = true;
        } else {
            this.node.getChildByName("ui_top").getChildByName("btn_qiandao").getComponent(cc.Button).interactable = true;
        }
    },
    
    btnClickDelete: function () {
        this.curShowManage();
        Utils.showTips("把不需要的房子拖入此处，可以删除");
    },

    btnClickInvite: function () {
        let self = this;
        this.curShowManage();
        this.node.getChildByName("ui_top").getChildByName("button").getComponent(cc.Button).interactable = false;
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.InviteList;
        var parmes = {
            userid: window.SystemInfo.serverStringId,
        };
        HttpHelp.httpPost(url, parmes, function (res) {
            if (res && res.errcode == 0) {
                let inviteCom = PanelManager.openPanel(window.PrefabType.InvitePanel);
                inviteCom.init(res.data);
                self.node.getChildByName("ui_top").getChildByName("button").getComponent(cc.Button).interactable = true;
            } else {
                self.node.getChildByName("ui_top").getChildByName("button").getComponent(cc.Button).interactable = true;
                require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
            }
        })
    },

    btnClikcOtherGame:function(){
        this.curShowManage();
        PanelManager.openPanel(window.PrefabType.OtherGame);
    },

    oneKeyAddHouse: function () {
        //拷贝
        var copyArr = function (arr) {
            let res = new Array();
            for (let i = 0; i < arr.length; i++) {
                res.push(arr[i])
            }
            return res
        }
        let copyHouseArray = copyArr(this.HouseArray);
        //排序
        var compare = function (obj1, obj2) {
            var val1 = obj1.houseData.lv;
            var val2 = obj2.houseData.lv;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
        copyHouseArray.sort(compare);
        //遍历检查
        var i = 0;
        var pre_o = null;
        for (i = copyHouseArray.length - 1; i >= 0; i--) {
            var o = copyHouseArray[i];
            if (pre_o) {
                if (o.houseData.lv == pre_o.houseData.lv) {
                    if (o.levelUp()) {
                        this.removeHouse(pre_o);
                        pre_o = null;
                    }
                }
                else {
                    pre_o = o;
                }
            }
            else {
                pre_o = o;
            }
        }
    },

    returnSameHouse: function (lvData) {
        //拷贝
        var copyArr = function (arr) {
            let res = new Array();
            for (let i = 0; i < arr.length; i++) {
                res.push(arr[i])
            }
            return res;
        }
        let copyHouseArray = copyArr(this.HouseArray);
        //排序
        var compare = function (obj1, obj2) {
            var val1 = obj1.houseData.lv;
            var val2 = obj2.houseData.lv;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }
        copyHouseArray.sort(compare);
        //遍历检查

        var sameArr = [];
        var i = 0;
        for (i = copyHouseArray.length - 1; i >= 0; i--) {
            var o = copyHouseArray[i];
            if (lvData.standBlock.blockData.id != o.standBlock.blockData.id && lvData.houseData.lv == o.houseData.lv) {
                sameArr.push(o);
            }
        }
        return sameArr;
    },

    showHouseMoney1: function () {
        if (window.SystemInfo.getServerTime() > 0) {
            for (var i = 0; i < this.BlockArray.length; i++) {
                var block = this.BlockArray[i]
                if (block.standHouse && block.standHouse.node.name == "HouseItem" && block.blockData.times == 1) {
                    block.standHouse.getProduceAnim();
                }
            }
        }
    },
    showHouseMoney2: function () {
        if (window.SystemInfo.getServerTime() > 0) {
            for (var i = 0; i < this.BlockArray.length; i++) {
                var block = this.BlockArray[i]
                if (block.standHouse && block.standHouse.node.name == "HouseItem" && block.blockData.times == 2) {
                    block.standHouse.getProduceAnim();
                }
            }
        }
    },
    showHouseMoney3: function () {
        if (window.SystemInfo.getServerTime() > 0) {
            for (var i = 0; i < this.BlockArray.length; i++) {
                var block = this.BlockArray[i]
                if (block.standHouse && block.standHouse.node.name == "HouseItem" && block.blockData.times == 3) {
                    block.standHouse.getProduceAnim();
                }
            }
        }
    },
    showHouseMoney4: function () {
        if (window.SystemInfo.getServerTime() > 0) {
            for (var i = 0; i < this.BlockArray.length; i++) {
                var block = this.BlockArray[i]
                if (block.standHouse && block.standHouse.node.name == "HouseItem" && block.blockData.times == 4) {
                    block.standHouse.getProduceAnim();
                }
            }
        }
    },

    showGoldTip: function (money) {
        let self = this;
        let gold = money;
        if (window.GameData.level >= 7) {
            gold = this.getBuyCost(window.GameData.level - 4);
        }
        var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.GoldTips);
        var reward = window.GameData.getRewardSetting(window.RewardSetting.GoldTips);
        var len = json.count;
        var btnstr = window.MessageBoxSpr.Word_LingQu;
        if (json.count >= reward.length) {
            len = reward.length - 1;
        }
        if (reward && reward[len] == 1) {
            btnstr = window.MessageBoxSpr.SeeVideo;
        }
        if (parseInt(json.count) < parseInt(json.maxcount)) {
            let message = Utils.showMessageBoxNoClose(true, true, " + " + BigNumber.getShowString(gold + ""), function () { }, function () {
                if (reward && reward[len] == 1) {
                    self.showVideo(message, gold);
                } else {
                    self.shareFunc(message, gold);
                }

            }, function () { }, window.MessageBoxSpr.GreenOk, btnstr);
        } else {
            Utils.showMessageBoxNoClose(false, false, "金币不足哦 \n 今日免费获取金币次数已达上限", function () { }, function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
        }
    },

    showVideo: function (message, gold) {
        let self = this;
        message.btnOther.interactable = false;
        WXHelp.createVideo(window.BannerVedioId.GoldTipVideo, function () {
            message.node.destroy();
            window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.GoldTips);
            window.GameData.setGold(BigNumber.add(window.GameData.gold, gold + ""));
            Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(gold) + "金币", function () { },
                function () {
                    if (message.node) {
                        message.node.destroy();
                    }
                }, function () {
                    if (message.node) {
                        message.node.destroy();
                    }
                }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
        }, function () { 
            message.btnOther.interactable = true;
            self.shareFunc(message, gold);
        },function(){
            message.btnOther.interactable = true;
        });
    },

    shareFunc: function (message, gold) {
        let self = this;
        message.btnOther.interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.GoldTips;
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    message.node.destroy();
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.GoldTips);
                    window.GameData.setGold(BigNumber.add(window.GameData.gold, gold + ""));
                    Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(gold) + "金币", function () { },
                        function () {
                            if (message.node) {
                                message.node.destroy();
                            }
                        }, function () {
                            if (message.node) {
                                message.node.destroy();
                            }
                        }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                } else if (window.SystemInfo.isSuccess == 0) {
                    message.btnOther.interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                    window.SystemInfo.isSuccess = -1;
                }
            }, 800);
        });
    },

    showOwnerChat: function () {
        this.labeltime.string = window.GameData.ownerchattime + "s";
        if (window.GameData.level >= window.OpenLevel.BaoZuPo) {
            if (window.GameData.ownerchattime <= 0) {
                this.imgwoman.getChildByName("img_fuhao").active = true;
                this.imgwoman.getChildByName("icon_timeBao").active = false;
            } else {
                this.imgwoman.getChildByName("img_fuhao").active = false;
                this.imgwoman.getChildByName("icon_timeBao").active = true;
            }
        } else {
            this.imgwoman.getChildByName("img_fuhao").active = false;
            this.imgwoman.getChildByName("icon_timeBao").active = false;
        }
    },

    setOwnerChatHide:function(){
        this.imgwoman.getChildByName("img_fuhao").active = false;
        this.imgwoman.getChildByName("icon_timeBao").active = false;
    },  

    btnClickOwnerChat: function () {
        if (this.imgwoman.getChildByName("img_fuhao").active) {
            CallBackHelp.callFunc(window.CallBackMsg.ClickBaoZuPo, null);
            var btn_buyHouse = this.node.getChildByName("ui_down").getChildByName("btn_buyHouse");
            let buGold = this.getBuyCost(btn_buyHouse._lv);
            let compont = PanelManager.openPanel(window.PrefabType.OwnerChat);
            compont.init(buGold);
            this.imgwoman.getChildByName("img_fuhao").active = false;
        }
    },

    getBuyHouse: function (buylevel) {
        var level = buylevel;
        let buyCostmax = this.getBuyCost(buylevel);
        let buyCostmid = this.getBuyCost(buylevel - 1);
        let buyCostmin = this.getBuyCost(buylevel - 2);
        if (buyCostmax / 2 < buyCostmid) {
            level = buylevel;
        } else {
            if (buyCostmid / 2 < buyCostmin) {
                level = buylevel - 1;
            } else {
                level = buylevel - 2;
            }
        }
        return level;
    },

    onClickItem()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_item);
    },

    onClickToHall()
    {
        Utils.showMessageBox(false, false, "确定要返回大厅吗？", function () {
            cc.director.loadScene('HallScene');
        }, function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.YellowCancel);
    },
});
