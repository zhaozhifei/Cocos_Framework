/*
 * @Author: mengjl
 * @Date: 2020-02-10 20:00:15
 * @LastEditTime: 2020-02-26 14:17:17
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Core\Windows\SystemInfo.js
 */

let Utils = require("Utils");
let CallBackHelp = require("CallBackHelp");
window.SystemInfo = {
    isLoaded: false,
    serverStringId: null,

    startTime :0,//切后台的时间
    isSuccess:-1, //分享是否成功

    serverTime: 0,
    serverInterval: null,
    getServerTime:function(){
        return this.serverTime;
    },
    setServerTime:function(num){
        this.serverTime = num;
    },

    refreshServerTime:function(){
        console.log("更新时间");
        let self = this;
        let url = window.ServerFuncUrl.Base + window.ServerFuncUrl.ServerTime;
        var parmes = {
        };
        
        require("HttpHelp").httpPost(url,parmes,function(res){
            if(res && parseInt(res.time) > 0){
                self.serverTime = parseInt(res.time);
                CallBackHelp.callFunc(window.CallBackMsg.CheckNewDay, null);
            }
            else{
                self.refreshServerTime();
            }
        })

        if(!self.serverInterval){
            self.serverInterval = setInterval(function(){
                if(self.serverTime > 0){
                    self.serverTime += 500;
                }
            },500);
        }
    },

    setStartTime:function(){
        this.startTime = Date.now();
    },

    setEndTime :function(){
        // modify by Jack
        return;
        
        var end = Date.now();
        console.log('---sharetime-->',end - this.startTime);
        let sharetime = parseInt(window.GameData.getShareNumToday(window.ShareOrSeeVideo.DelayConfirm).chance) * 1000;
        let json = null;
        if(window.curShareType == ""){
            return;
        }else{
            json = window.GameData.getShareNumToday(window.curShareType);
        }
        console.log("--json-->",JSON.stringify(json));
        if(end - this.startTime < sharetime){
            this.isSuccess = 0;
        }else if(end - this.startTime >= sharetime){
            let chance = this.getChanceForCount(json);
            if(json.lastSuccess == 0){
                chance = 100
            }
            console.log("--chance->",chance);
            if(chance == 100){
                this.isSuccess = 1;
            }else if(chance == 0){
                this.isSuccess = 0;
            }else{
                var change = chance/100;
                var arr1 = [0 ,1];
                var arr2 = [1 - change , change];
                var random = Utils.randomDraw(arr1,arr2);
                this.isSuccess = random;
            }
            window.GameData.setShareNumTodayLastSuc(window.curShareType,this.isSuccess);
            window.curShareType = "";
        }
    },

    getChanceForCount:function(json){
        let count = json.count;
        for(var i = 0; i < json.chance.length; i++){
            if(count >= json.chance[i]["count"]){
                return json.chance[i]["chance"]
            }
        }
        return 100;
    },
};