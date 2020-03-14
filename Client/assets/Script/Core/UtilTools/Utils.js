let CallBackHelp = require("CallBackHelp");
let PanelManager = require("PanelManager");
let JsonConfig = require("JsonConfig");
let BigNumber  = require("BigNumber");
let md5 = require("md5");

module.exports = {
    getdata:function(){
        var date = new Date();
        date.getYear();//获取当前年份(2位)
        date.getFullYear(); //获取完整的年份(4位,1970-????)
        date.getMonth(); //获取当前月份(0-11,0代表1月)
        date.getDate(); //获取当前日(1-31)
        date.getDay(); //获取当前星期X(0-6,0代表星期天)
        date.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
        console.log("date.getTime():" + date.getTime());
        date.getHours(); //获取当前小时数(0-23)
        date.getMinutes(); //获取当前分钟数(0-59)
        date.getSeconds(); //获取当前秒数(0-59)
        date.getMilliseconds(); //获取当前毫秒数(0-999)
        date.toLocaleDateString(); //获取当前日期
        var mytime=date.toLocaleTimeString();//获取当前时间
        console.log("date.toLocaleTimeString():" + date.toLocaleTimeString());
        date.toLocaleString(); //获取日期与时间
        console.log("date.toLocaleString():" + date.toLocaleString());
    },

    getSecondsTickString:function(num){
        let minutes = Math.floor(num/60);
        let seconds = Math.floor(num%60);
        let retString = minutes + ":" + (seconds >= 10 ? seconds : ("0" + seconds));
        return retString
    },

    getSecondsTickStringForHour:function(num){
        let minutes = Math.floor(num/60);
        let hour =  Math.floor(minutes/60);
        let min =  Math.floor(minutes%60);
        let retString = ((hour == 0)? "" : hour + "时") + min + "分钟";
        return retString
    },

    judgeOfHour:function(num){
        let minutes = Math.floor(num/60);
        let hour =  Math.floor(minutes/60);
        return hour;
    },

    judgeTime:function(timestamp,curTime) {
        timestamp = parseInt(timestamp);
        if(!timestamp) return false;
        var date = new Date(timestamp *1000); 
        var curdate = new Date(curTime *1000);
        if((date.getFullYear() ==  curdate.getFullYear()) && (date.getMonth()+1 == curdate.getMonth()+1) && (date.getDate() == curdate.getDate())){
            return true;
        }
        return false;
    },

    random:function(max,min){
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    showTips(desc){
        // CallBackHelp.callFunc(window.CallBackMsg.AddTipsShow,null);
        
        // let component = PanelManager.openPanel(window.PrefabType.TipsShow);
        // component.setDesc(desc);
        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : desc});
    },

    showMessageBox(title,isShowJinbi,desc,confirmFunc,otherFunc,closeFunc,confirmCon,otherCon,showHouseSpr){ 
        let component = PanelManager.openPanel(window.PrefabType.MessageBox);
        component.setTitle(title);
        component.setDesc(desc,showHouseSpr,isShowJinbi);
        component.setBtnLabelSpr(confirmCon,otherCon);
        component.setCallBackOther(otherFunc);
        component.setCallBackConfirm(confirmFunc);
        component.setCloseFunc(closeFunc);
        return component;
    },
    
    showMessageBoxNoClose(title,isShowJinbi,desc,confirmFunc,otherFunc,closeFunc,confirmCon,otherCon,showHouseSpr){
        var message = this.showMessageBox(title,isShowJinbi,desc,confirmFunc,otherFunc,closeFunc,confirmCon,otherCon,showHouseSpr);
        message.node.getChildByName("btn_close").active = false;
        return message;
    },

    shake:function(node){
        node.stopAllActions();
        var action = cc.repeatForever(cc.sequence(
            cc.spawn(cc.moveBy(0.1,12,0),cc.rotateBy(0.1,10)),
            cc.spawn(cc.moveBy(0.1,-12,0),cc.rotateBy(0.1,-10)),
            cc.spawn(cc.moveBy(0.1,12,0),cc.rotateBy(0.1,10)),
            cc.spawn(cc.moveBy(0.1,-12,0),cc.rotateBy(0.1,-10)),
            cc.spawn(cc.moveBy(0.1,12,0),cc.rotateBy(0.1,10)),
            cc.spawn(cc.moveBy(0.1,-12,0),cc.rotateBy(0.1,-10)),
            cc.delayTime(this.random(4,1))
        ));
        node.runAction(action);
    },

    /**
     * 设置地砖
     * @param {*} isClick 
     * @param {*} node 
     * @param {*} oldNode 
     */
    setMapOnClickHouse:function(isClick,node,oldNode){
        if(isClick){
            node.img_maparea.node.color = cc.color(192,195,195);
            node.img_maparea.node.y = 0;
        }else{
            node.img_maparea.node.color = cc.color(255,255,255);
            node.img_maparea.node.y = 5;
            if(oldNode){
                oldNode.img_maparea.node.color = cc.color(255,255,255);
                oldNode.img_maparea.node.y = 5;
            }
        }
    },

    getShowMapLen:function(){
        var lenForShare = 0;
        var lenForLv = 0;
        if(window.GameData.share < 6){
            lenForShare = 12;
        }else{
            lenForShare = JsonConfig.loadItems.BlockConfig.length;
        }
        if(window.GameData.level < 10){
            lenForLv = 12;
        }else{
            lenForLv = JsonConfig.loadItems.BlockConfig.length;
        }
        var len = (lenForLv >= lenForShare) ?lenForLv:lenForShare;
        return len;
    },

    getScaleData:function(){
        var len = this.getShowMapLen();
        if(window.IsPhoneType == "pad"){
            if(len == 12){
                return 0.8;
            }else{
                return 0.6;
            }
        }else{
            if(len == 12){
                return 1;
            }else{
                return 1;
            }
        }
        
    },

    /**
     * 个人信息数据的加密
     * @param {} resdata 
     */
    setUserDataToMd5:function(resdata){
        var str = resdata.nickName + resdata.gender + resdata.city + resdata.avatarUrl;
        return md5.md5(str);
    },

    /**
     * 接口信息的加密
     */
    paramsToMd5:function(url,param){
        var arr = url.split("/");
        var str = arr[arr.length - 1];
        str = str + JSON.stringify(param) + window.secretkey;
        return md5.md5(str);
    },

    //加密
    btoaUserInfo:function(userinfo){
        var str = md5.encode(userinfo.nickName);
        userinfo.nickName = str;
        return userinfo;
    },

    jiamiData:function(data){
        var str = md5.encode(data);
        return str;
    },

    //解密
    atobUserInfo:function(nickname){
        var str = md5.decode(nickname);
        return str;
    },

    createImage:function(url,node){
        let self = this;
        if(url){
            cc.loader.load({
                url: url, type: 'png'
            }, (err, texture) => {
                if(!err && self){
                    let sp = node;
                    sp.spriteFrame = new cc.SpriteFrame(texture);
                    sp.type = cc.Sprite.Type.SIMPLE;
                    sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                }
            });
        }
    },

    /**
     * 概率计算
     */
    randomDraw: function (arr1, arr2) {
        var sum = 0,
            factor = 0,
            random = Math.random();

        for (var i = arr2.length - 1; i >= 0; i--) {
            sum += arr2[i]; // 统计概率总和
        };

        random *= sum; // 生成概率随机数

        for (var i = arr2.length - 1; i >= 0; i--) {
            factor += arr2[i];
            if (random <= factor) {
                return arr1[i];
            }
        }
        return null;
    },

    setScaleForLv:function(lv){
        if(lv >= 1 && lv <= 3){
            return 0.8;
        }else if(lv >= 4 && lv <= 6){
            return 0.85;
        }else if(lv >= 7 && lv <= 10){
            return 0.9;
        }else if(lv >= 11 && lv <= 14){
            return 0.95;
        }else if(lv >= 15 && lv <= 18){
            return 1;
        }else if(lv >= 19 && lv <= 20){
            return 1.05;
        }else{
            return 1.1;
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

    getShareFailCon:function(){
        var random = this.random(1,0);
        return random == 1 ? "请不要连续骚扰同一个好友":"请不要分享在同一个群聊";
    },
};