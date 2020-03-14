let HttpHelp = require("HttpHelp");
let Utils = require("Utils");

window.ServerStorage = {
    localStorageVersion: cc.sys.localStorage.getItem(window.StorageKey.StorageVersion),
    localServerStringId: cc.sys.localStorage.getItem(window.StorageKey.ServerStringId),

    saveStart: function(serverStringId){
        //检测数据保存的版本
        window.SystemInfo.serverStringId = serverStringId;
        this.getServerStorage();
        cc.sys.localStorage.setItem(window.StorageKey.ServerStringId, serverStringId);
    },

    //保存到服务器(游戏进行中)
    saveServerStorage: function(){
        window.SystemInfo.storageVersion = parseInt(window.SystemInfo.storageVersion) + 1;
        cc.sys.localStorage.setItem(window.StorageKey.StorageVersion, window.SystemInfo.storageVersion);
        console.log("--window.SystemInfo.storageVersion-cun-->",window.SystemInfo.storageVersion)
        let data = window.GameData.getStorage();
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.SaveStorage;
        let parmes = {
            userid: window.SystemInfo.serverStringId, 
            gameData: data,
        };
        HttpHelp.httpPost(url,parmes,function(res){  //{"sharenum":"0","dataversion":"1"}
            //成功
            {
                if(res){
                    if(parseInt(res.sharenum) > parseInt(window.GameData.share)){
                        window.GameData.setShare(res.sharenum);
                    }
                }else {
                    // require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
                }
            }
        });
    },

    //获取服务器数据(游戏开始前)
    getServerStorage: function(){
        let self = this;
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.GetStorage;
        let parmes = {
            userid: window.SystemInfo.serverStringId,  
        };
        HttpHelp.httpPost(url,parmes,function(res){  
            console.log('---gameDAta res>',JSON.stringify(res));
            if(res){
                if(self.localServerStringId == window.SystemInfo.serverStringId) {
                    if(res.dataversion >= self.localStorageVersion){//如果本地版本号小于等于服务端的，取服务端数据
                        console.log("---取服务器--->")
                        let data = self.mergeDataToGame(res);
                        cc.sys.localStorage.setItem(window.StorageKey.GameData, JSON.stringify(data));
                    }else{
                        console.log("---取本地--->")
                    }
                }else{
                    console.log("--新用户--->")
                    let data = self.mergeDataToGame(res);
                    cc.sys.localStorage.setItem(window.StorageKey.GameData, JSON.stringify(data));
                }
                window.SystemInfo.storageVersion = res.dataversion;
                cc.sys.localStorage.setItem(window.StorageKey.StorageVersion, window.SystemInfo.storageVersion);
                
                console.log("--window.SystemInfo.storageVersion--qu->",window.SystemInfo.storageVersion)
                cc.log("SceneName:" + cc.director.getScene().name);
                if(cc.director.getScene().name == "MainScene"){
                    cc.director.loadScene('LoadScene');
                }
            }else {
                require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
            }
        });
    },

    //{"dataversion":"1","gold":"1500","produce":"0","share":0,"level":1,"diamond":100,"timestick":0,"regtime":"0","signtime":"0","signcount":0,"addedtimestick":0,
    //"ishavelongclick":0,"savetime":"0","buycount":"[]","housesave":"[]","curgetcount":"[]","gifttime":"[]","giftsave":"[]","drakreward":"[]"}
    mergeDataToGame:function(gameData){
        let data = {};
        data.gold = gameData.gold;    
        data.produce = gameData.produce;    
        data.share = gameData.share;    
        data.level = gameData.level;    
        data.diamond = gameData.diamond;    
        data.timesTick = gameData.timestick;  
        data.buyCount = gameData.buycount;    
        data.houseSave = gameData.housesave;
        data.saveTime = gameData.savetime;
        data.regTime = gameData.regtime;
        data.signTime = gameData.signtime;
        data.signCount = gameData.signcount;
        data.addedTimesTick = gameData.addedtimestick;
        data.isHaveLongClick = gameData.ishavelongclick;
        data.curGetCount = gameData.curgetcount;
        data.giftTime = gameData.gifttime;
        data.giftSave = gameData.giftsave;
        data.drakReward = gameData.drakreward;
        data.dropHouse = gameData.drophouse;
        return data;
    },

    /**
     * 获取分享以及看视频次数
     */
    getHasRewardList:function(userid){
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.GetHasRewardList;
        let parmes = {
            userid: userid,  
        };
        HttpHelp.httpPost(url,parmes,function(res){  
            if(res && res.data){
                let dataArr = [];
                for(var i = 0;i < res.data.length;i++){
                    let data = {};
                    data["name"] = res.data[i].name;
                    data["maxcount"] = res.data[i].maxcount;
                    data["chance"] = res.data[i].chance;
                    data["count"] = res.data[i].count;
                    data["lastSuccess"] = 0;
                    dataArr.push(data);
                }
                cc.sys.localStorage.setItem(window.StorageKey.ShareCount, dataArr);
            }else {
                require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
            }
        });
    },

    getUserInfoDif:function(md5str){
        let localMd5UserInfo = cc.sys.localStorage.getItem(window.StorageKey.Md5UserInfo);
        if(md5str == localMd5UserInfo){
            return true;
        }
        cc.sys.localStorage.setItem(window.StorageKey.Md5UserInfo,md5str);
        return false;
    },

    // 0;-- 成功追加 返回0
    // 1;-- 已经达到限制 返回1
    // -1;-- 其他数据操作异常统一 返回 -1
    // -100; -- 账号不存在或者被禁用
    checkShareNum:function(shareType){
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.checkShareNum;
        var parmes = {
            userid: window.SystemInfo.serverStringId,
            rewardname: shareType,
        };
        HttpHelp.httpPost(url, parmes, function (res) {
            if (res && res.errcode == 0) {
                window.GameData.setShareNumToday(shareType);
                window.GameData.addDrakReward("share");
            }else if(res.errcode == 1){
                require("Utils").showTips("已超过分享限制")
            }else{
                require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
            }
        });
    },

    readSetting:function(){
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.ReadSetting;
        var parmes = {
            key:"ordertype", 
            app:"baozupo", 
            platform:"wechat_mini",
        };
        HttpHelp.httpPost(url, parmes, function (res) {
            console.log("---readSetting-->",JSON.parse(res.data));
            if(res.errcode == 0){
                window.GameData.rewardSetting = JSON.parse(res.data);
            }
        });
    },
};