let CallBackHelp = require("CallBackHelp");
let JsonConfig = require("JsonConfig");
module.exports = {
    spriteFrameMap:{},
    prefabMap:{},
    urlMap:{},

    loadMaxNum: 0,
    loadedNum: 0,

    loadProgress: function(){
        var progress = this.loadedNum/this.loadMaxNum;
        CallBackHelp.callFunc(window.CallBackMsg.ImageLoadProgress,progress);
    },

    loadAll: function(){
        this.loadMaxNum = 0;
        this.loadedNum = 0;
        var i = 0;
        var o;
        for(i = 0; i < JsonConfig.loadItems.PreLoadConfig.spriteFrameMap.length; i++){
            o = JsonConfig.loadItems.PreLoadConfig.spriteFrameMap[i];
            this.loadSpriteFrame(o)
        }
       
        // for(i = 0; i < JsonConfig.loadItems.ShareConfig.length; i++){
        //     o = JsonConfig.loadItems.ShareConfig[i];
        //     this.loadUrl(o)
        // }
        
        for(i = 0; i < JsonConfig.loadItems.PreLoadConfig.prefabMap.length; i++){
            o = JsonConfig.loadItems.PreLoadConfig.prefabMap[i];
            this.loadPrefabFrame(o)
        }
        return this.loadMaxNum;
    },

    loadSpriteFrame: function(configRow)
    {
        var self = this;
        self.loadMaxNum += 1;
        //读取gamelist.json文件
        var url = configRow.path;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if(!err){
                self.spriteFrameMap[configRow.id] = spriteFrame;
                self.loadedNum += 1;
                self.loadProgress();
            }
            else{
                console.log("loadSpriteFrame Failed:" + url);
                self.spriteFrameMap[url] = null;
            }
        });
    },

    loadUrl: function(configRow)
    {
        var self = this;
        self.loadMaxNum += 1;
        var url = configRow.path;
        cc.loader.loadRes(url, function (err, data) {
            if(!err){
                self.urlMap[configRow.id] = data.url;
                self.loadedNum += 1;
                self.loadProgress();
            }
            else{
                console.log("loadSpriteFrame Failed:" + url);
                self.urlMap[url] = null;
            }
        });
    },

    loadPrefabFrame: function(configRow)
    {
        var self = this;
        self.loadMaxNum += 1;
        //读取gamelist.json文件
        var url = configRow.path;
        cc.loader.loadRes(url, function (err, prefab) {
            if(!err){
                self.prefabMap[configRow.id] = {config:configRow,res:prefab};
                // self.prefabMap[configRow.id] = prefab;
                self.loadedNum += 1;
                self.loadProgress();
            }
            else{
                console.log("loadSpriteFrame Failed:" + url);
                self.prefabMap[url] = null;
            }
        });
    },

    getSpriteFrameWithKey(k)
    {
        if(k && k != ""){
            var image = this.spriteFrameMap[k];
            return image;
        }
        else{
            return null;
        }
    },

    getUrlWithKey(k)
    {
        if(k && k != ""){
            var image = this.urlMap[k];
            return image;
        }
        else{
            return null;
        }
    },
    getPrefabWithKey(k)
    {
        if(k && k != ""){
            var prefab = this.prefabMap[k];
            return prefab;
        }
        else{
            return null;
        }
    }
};