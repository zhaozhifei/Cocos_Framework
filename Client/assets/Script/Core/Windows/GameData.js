let CallBackHelp = require("CallBackHelp");
let BigNumber = require("BigNumber");
let Utils = require("Utils");
let WXHelp = require("WXHelp");

window.GameData = {
    gold: "1500",       //金币
    produce: "0",   //产出
    share: 0,       //邀请的人数
    level: 1,       //最高房子等级
    diamond: 0,     //钻石
    timesTick: 0,   //加倍时间
    saveTime: 0,    //存储时间
    buyCount: new Array(),   //购买次数
    houseSave: new Array(),  //当前房子信息

    regTime: 0,//第一次进入游戏时间
    signTime: 0, //签到时间
    signCount: 0,//签到次数

    addedTimesTick: 0,
    dropHouse: 1,

    isHaveLongClick: 0,
    curGetCount: new Array(),   //当前的领取次数 [金币、钻石、房子]
    giftTime: new Array(),      //领取时间
    giftSave: new Array(),      //当前礼盒信息
    drakReward: new Array(),     //暗奖励

    item_list : new Object(),   // add by Jack

    isMusic: 1,
    isEffect: 1,
    shareNumToday: new Array(),
    rewardSetting: null,

    isSeeVideo: false,
    banner: null,
    bannerCount:0,

    ownerchattime: 0,

    shenhe:false,//审核开关
    subOwnerchattime: function (num) {
        this.ownerchattime -= num;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeOwnerChatTime, this.ownerchattime);
    },

    setOwnerchattime: function (num) {
        // if (this.getShareNumToday(window.ShareOrSeeVideo.OwnerChat).count < 20) {
        //     this.ownerchattime = num + parseInt(this.getShareNumToday(window.ShareOrSeeVideo.OwnerChat).count) * 5;
        //     CallBackHelp.callFunc(window.CallBackMsg.ChangeOwnerChatTime, this.ownerchattime);
        // }
    },

    getBannerCount:function(){
        var count = cc.sys.localStorage.getItem(window.StorageKey.BannerCount);
        if(count != null){
            this.bannerCount = parseInt(count);
            return this.bannerCount;
        }
        return 0;
    },

    setBannerCount:function(num){
        var count = this.getBannerCount();
        this.bannerCount = count + num;
        cc.sys.localStorage.setItem(window.StorageKey.BannerCount,this.bannerCount);
    },

    cleanBannerCount:function(){
        this.bannerCount = 0;
        cc.sys.localStorage.setItem(window.StorageKey.BannerCount,this.bannerCount);
    },

    getRewardSetting: function (typeName) {
        // if (this.rewardSetting[typeName]) {
        //     return this.rewardSetting[typeName];
        // }
        return null;
    },

    setRegTime: function (num) {
        this.regTime = parseInt(num);
    },
    //获取账号注册时间
    getFirstInGameTime() {
        return this.regTime * 1000;
    },
    //根据天数获取数据
    getSignData(day) {
        let _day = day % 7;
        if (_day < 0) {
            _day += 7;
        }
        return Math.floor(this.signCount % Math.pow(10, _day + 1) / Math.pow(10, _day)) * Math.pow(10, _day);
    },
    //只保留今天和昨天的数据
    signYesterday(day) {
        let _day = day % 7;
        if (_day < 0) {
            _day += 7;
        }
        this.signCount = Math.floor(Math.pow(10, day) + this.getSignData(_day + 1));
    },
    //只保留今天和昨天的数据
    signToday(day) {
        let _day = day % 7;
        if (_day < 0) {
            _day += 7;
        }
        this.signCount = Math.floor(Math.pow(10, day) + this.getSignData(_day - 1));
    },
    //清空签到数据
    clearSignData() {
        this.signCount = 0;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeCurSginTime, 0);
    },
    setSignTime: function (num) {
        this.signTime = Math.floor(num / 1000);
        CallBackHelp.callFunc(window.CallBackMsg.ChangeCurSginTime, 0);
    },
    getSignTime: function () {
        return this.signTime * 1000;
    },

    getIsMusic: function () {
        var music = cc.sys.localStorage.getItem(window.StorageKey.IsMusic);
        if (music != null) {
            this.isMusic = music;
            return this.isMusic;
        }
        return 1;
    },

    getIsEffect: function () {
        var effect = cc.sys.localStorage.getItem(window.StorageKey.IsEffect);
        if (effect != null) {
            this.isEffect = effect;
            return this.isEffect;
        }
        return 1;
    },

    setIsMusic: function (num) {
        this.isMusic = num;
        cc.sys.localStorage.setItem(window.StorageKey.IsMusic, num);
    },

    setIsEffect: function (num) {
        this.isEffect = num;
        cc.sys.localStorage.setItem(window.StorageKey.IsEffect, num);
    },

    setShareNumToday: function (type) {
        var sharecounr = cc.sys.localStorage.getItem(window.StorageKey.ShareCount);
        if (sharecounr != null) {
            this.shareNumToday = sharecounr;
        }

        for (var i = 0; i < this.shareNumToday.length; i++) {
            if (this.shareNumToday[i].name == type) {
                this.shareNumToday[i].count = parseInt(this.shareNumToday[i].count) + 1;
                cc.sys.localStorage.setItem(window.StorageKey.ShareCount, this.shareNumToday);
                CallBackHelp.callFunc(window.CallBackMsg.ChangeTodayShareCount, null);
                break;
            }
        }
    },

    setShareNumTodayLastSuc: function (type, suc) {
        var sharecounr = cc.sys.localStorage.getItem(window.StorageKey.ShareCount);
        if (sharecounr != null) {
            this.shareNumToday = sharecounr;
        }

        for (var i = 0; i < this.shareNumToday.length; i++) {
            if (this.shareNumToday[i].name == type) {
                this.shareNumToday[i].lastSuccess = suc;
                cc.sys.localStorage.setItem(window.StorageKey.ShareCount, this.shareNumToday);
                break;
            }
        }
    },

    getShareNumToday: function (type) {
        var sharecounr = cc.sys.localStorage.getItem(window.StorageKey.ShareCount);
        if (sharecounr != null) {
            this.shareNumToday = sharecounr;
        }
        for (var i = 0; i < this.shareNumToday.length; i++) {
            if (this.shareNumToday[i].name == type) {
                return this.shareNumToday[i];
            }
        }
        return null;
    },

    addDrakReward: function (type) {
        let i = 0;
        let o = null;
        for (i = 0; i < this.drakReward.length; i++) {
            if (this.drakReward[i].type == type) {
                this.drakReward[i].count += 1;
                o = this.drakReward[i];
            }
        }
        if (o == null) {
            o = {};
            o.type = type;
            o.count = 1;
            this.drakReward.push(o);
        }
        CallBackHelp.callFunc(window.CallBackMsg.ChangeDrakRewardCount, type);
    },

    getDrakReward: function (type) {
        let o;
        for (let i = 0; i < this.drakReward.length; i++) {
            o = this.drakReward[i];
            if (o.type == type) {
                return o.count;
            }
        }
        return 0;
    },

    setGiftSave: function (giftSave) {
        this.giftSave = giftSave;
    },

    getGiftInSaveBlock: function (block_id) {
        let i = 0;
        let o = null;
        for (i = 0; i < this.giftSave.length; i++) {
            o = this.giftSave[i];
            if (o.block_id == block_id) {
                return o;
            }
        }
        return null;
    },

    subGiftTime: function (num) {
        for (var i = 0; i < this.giftTime.length; i++) {
            if (this.giftTime[i] > 0) {
                this.giftTime[i] -= num;
                CallBackHelp.callFunc(window.CallBackMsg.ChangeGiftTime, this.giftTime);
            }
        }
    },

    setGiftTime: function (type, num) {
        this.giftTime[type] = num;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeGiftTime, this.giftTime);
    },

    addGetCount: function (type) {
        let i = 0;
        let o = null;
        for (i = 0; i < this.curGetCount.length; i++) {
            if (this.curGetCount[i].type == type) {
                this.curGetCount[i].count += 1;
                o = this.curGetCount[i];
            }
        }
        if (o == null) {
            o = {};
            o.type = type;
            o.count = 1;
            this.curGetCount.push(o);
        }
    },

    getGetCount: function (type) {
        let o;
        for (let i = 0; i < this.curGetCount.length; i++) {
            o = this.curGetCount[i];
            if (o.type == type) {
                return o.count;
            }
        }
        return 0;
    },

    setIsHaveLongClick: function (num) {
        this.isHaveLongClick = num;
    },

    setAddedTimesTick: function (num) {
        this.addedTimesTick = num;
    },

    setGold: function (numStr) {
        this.gold = numStr;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeGold, this.gold);
    },
    setProduce: function (numStr) {
        this.produce = numStr;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeProduce, this.produce);
    },
    setShare: function (num) {
        this.share = num;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeShare, this.share);
    },
    setLevel: function (num) {
        this.level = num;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeLevel, this.level);
    },
    setDiamond: function (num) {
        if (isNaN(num)) {
        } else {
            this.diamond = num;
        }
        CallBackHelp.callFunc(window.CallBackMsg.ChangeDiamond, this.diamond);
    },

    subTimesTick: function (num) {
        if (this.timesTick > 0) {
            this.timesTick -= num;
            CallBackHelp.callFunc(window.CallBackMsg.ChangeTimesTick, this.timesTick);
        }
    },

    setTimesTick: function (num) {
        this.timesTick = num;
        CallBackHelp.callFunc(window.CallBackMsg.ChangeTimesTick, this.timesTick);
    },

    setHouseSave: function (houseSave) {
        this.houseSave = houseSave;
    },

    getHouseInSaveBlock: function (block_id) {
        let i = 0;
        let o = null;
        for (i = 0; i < this.houseSave.length; i++) {
            o = this.houseSave[i];
            if (o.block_id == block_id) {
                return o;
            }
        }
        return null;
    },

    addBuyCount: function (lv) {
        let i = 0;
        let o = null;
        for (i = 0; i < this.buyCount.length; i++) {
            if (this.buyCount[i].lv == lv) {
                this.buyCount[i].count += 1;
                o = this.buyCount[i];
            }
        }
        if (o == null) {
            o = {};
            o.lv = lv;
            o.count = 1;
            this.buyCount.push(o);
        }
        CallBackHelp.callFunc(window.CallBackMsg.ChangeBuyCount, o);
    },
    getBuyCount: function (lv) {
        let i = 0;
        let o;
        for (i = 0; i < this.buyCount.length; i++) {
            o = this.buyCount[i];
            if (o.lv == lv) {
                return o.count;
            }
        }
        return 0;
    },

    //读取本地数据到内存
    initStorage: function () {
        this.gold = "0";     //金币
        this.produce = "0";   //产出
        this.share = 0;   //邀请的人数
        this.level = 1;       //最高房子等级
        this.diamond = 0;     //钻石
        this.timesTick = 0;

        this.saveTime = 0;

        this.buyCount = new Array();  //购买次数
        this.houseSave = new Array();  //当前房子信息

        // this.regTime = 0,//第一次进入游戏时间

        this.signTime = 0;
        this.signCount = 0;
        this.addedTimesTick = 0;
        this.isHaveLongClick = 0;

        this.curGetCount = new Array();
        this.giftTime = new Array();
        this.giftSave = new Array();
        this.drakReward = new Array();

        let storage = cc.sys.localStorage.getItem(window.StorageKey.GameData);
        if (storage) {
            let data = JSON.parse(storage);
            if (data.gold)
                this.gold = data.gold;
            if (data.produce)
                this.produce = data.produce;
            if (data.share)
                this.share = data.share;
            if (data.level)
                this.level = data.level;
            if (data.diamond)
                this.diamond = data.diamond;
            if (data.timesTick)
                this.timesTick = data.timesTick;
            if (data.saveTime)
                this.saveTime = parseInt(data.saveTime);
            if (data.buyCount)
                this.buyCount = data.buyCount;
            if (data.houseSave)
                this.houseSave = data.houseSave;
            // if(data.regTime && data.regTime !="0" && data.regTime !="")
            //     this.regTime = parseInt(data.regTime);
            if (data.signTime)
                this.signTime = parseInt(data.signTime);
            if (data.signCount)
                this.signCount = data.signCount;
            if (data.addedTimesTick)
                this.addedTimesTick = data.addedTimesTick;
            if (data.isHaveLongClick)
                this.isHaveLongClick = data.isHaveLongClick;
            if (data.curGetCount)
                this.curGetCount = data.curGetCount;
            if (data.giftTime)
                this.giftTime = data.giftTime;
            if (data.giftSave)
                this.giftSave = data.giftSave;
            if (data.drakReward)
                this.drakReward = data.drakReward;
            
            // add by Jack
            if (data.item_list) {
                this.item_list = data.item_list;
            }
        }
        if (window.SystemInfo.storageVersion < 10) {
            if (window.GameData.saveTime == "0" || window.GameData.saveTime == "") {
                this.houseSave.push({ block_id: 1, house_lv: 1 });
                this.houseSave.push({ block_id: 2, house_lv: 1 });
                this.houseSave.push({ block_id: 3, house_lv: 1 });
                this.houseSave.push({ block_id: 4, house_lv: 1 });
                this.houseSave.push({ block_id: 5, house_lv: 1 });
                this.houseSave.push({ block_id: 6, house_lv: 1 });
                this.setIsMusic(1);
                this.setIsEffect(1);
            }
        }
    },

    //获取内存数据
    getStorage: function () {
        let data = {}
        data.gold = this.gold;
        data.produce = this.produce;
        data.share = this.share;
        data.level = this.level;
        data.diamond = this.diamond;
        data.timesTick = this.timesTick;
        data.buyCount = this.buyCount;
        data.houseSave = this.houseSave;
        data.saveTime = this.saveTime.toString();
        data.regTime = this.regTime.toString();
        data.signTime = this.signTime.toString();
        data.signCount = this.signCount;
        data.addedTimesTick = this.addedTimesTick;
        data.dropHouse = this.dropHouse;
        data.isHaveLongClick = this.isHaveLongClick;

        data.curGetCount = this.curGetCount;
        data.giftTime = this.giftTime;
        data.giftSave = this.giftSave;
        data.drakReward = this.drakReward;

        data.goldtipcount = 0;
        data.ownerchatcount = 0;

        // add by Jack
        data.item_list = this.item_list;

        return data;
    },

    //保存数据到本地
    saveStorage: function () {
        // this.checkOutLineGold();
        let data = this.getStorage();
        let storage = JSON.stringify(data);
        cc.sys.localStorage.setItem(window.StorageKey.GameData, storage);
    },

    //检测离线金币
    checkOutLineGold: function (self) {
        let nowTime = window.SystemInfo.getServerTime();
        nowTime = Math.floor(nowTime / 1000);
        if (this.saveTime > 0) {
            let subTime = nowTime - this.saveTime;
            this.saveTime = nowTime;
            if (subTime > 3 && subTime < 60 * 3) {
                //小于5分钟
                let time_produce = BigNumber.mul(this.produce, subTime.toString());
                this.setGold(BigNumber.add(this.gold, time_produce));
            } else if (subTime >= 60 * 3) {
                // var json = window.GameData.getShareNumToday(window.ShareOrSeeVideo.OfflineGoldReward).chance[0];
                // if (subTime >= json.time) {
                //     subTime = json.time;
                // }
                // let time_produce = BigNumber.mul(this.produce, Math.floor(subTime * (json.rate)).toString());
                // console.log("time_produce:" + time_produce)
                // this.outLineNoti(subTime, time_produce);
            }
        }
        this.saveTime = nowTime;
    },

    outLineNoti: function (subTime, time_produce) {
        let self = this;
        var json = self.getShareNumToday(window.ShareOrSeeVideo.OfflineGold);
        var reward = self.getRewardSetting(window.RewardSetting.OfflineGold);
        var len = json.count;
        var btnstr = window.MessageBoxSpr.Word_FanBei;
        if (json.count >= reward.length) {
            len = reward.length - 1;
        }
        if (reward && reward[len] == 1) {
            btnstr = window.MessageBoxSpr.word_seex5;
        }
        let message = Utils.showMessageBoxNoClose(false, true, "本次离线" + Utils.getSecondsTickStringForHour(subTime) + "\n共获得金币" + BigNumber.getShowString(time_produce),
            function () {
                self.setGold(BigNumber.add(self.gold, time_produce));
                Utils.showMessageBox(false, true, "获得" + BigNumber.getShowString(time_produce) + "金币", function () { },
                    function () { }, function () { }, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
            },
            function () {
                message.btnOther.interactable = false;
                if (reward && reward[len] == 1) {
                    self.showVideo(message, time_produce);
                } else {
                    self.shareFunc(message, time_produce);
                }
            }, function () { }, window.MessageBoxSpr.GreenOk, btnstr);
    },

    shareFunc: function (message, time_produce) {
        let self = this;
        message.btnOther.interactable = false;
        WXHelp.shareAppMessageDiffGroup(function () {
            window.curShareType = window.ShareOrSeeVideo.OfflineGold;
            self.timer = setInterval(function () {
                if (window.SystemInfo.isSuccess != -1) {
                    clearInterval(self.timer);
                }
                if (window.SystemInfo.isSuccess == 1) {
                    window.SystemInfo.isSuccess = -1;
                    message.node.destroy();
                    var gold = BigNumber.mul(time_produce, "2");
                    self.setGold(BigNumber.add(self.gold, gold));
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
                    window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.OfflineGold);
                } else if (window.SystemInfo.isSuccess == 0) {
                    window.SystemInfo.isSuccess = -1;
                    message.btnOther.interactable = true;
                    WXHelp.showWXTips("提示", Utils.getShareFailCon());
                }
            }, 800);
        });
    },

    showVideo: function (message, time_produce) {
        let self = this;
        WXHelp.createVideo(window.BannerVedioId.OfflineGoldVideo, function () {
            message.node.destroy();
            var gold = BigNumber.mul(time_produce, "5");
            self.setGold(BigNumber.add(self.gold, gold));
            window.ServerStorage.checkShareNum(window.ShareOrSeeVideo.OfflineGold);
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
            self.shareFunc(message, time_produce);
        },function(){
            message.btnOther.interactable = true;
        });
    }
};