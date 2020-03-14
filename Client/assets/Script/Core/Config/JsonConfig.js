let CallBackHelp = require("CallBackHelp");
module.exports = {
    loadItems:{},

    loadMaxNum: 0,
    loadedNum: 0,

    loadProgress: function(){
        var progress = this.loadedNum/this.loadMaxNum;
        CallBackHelp.callFunc(window.CallBackMsg.JsonConfigLoadProgress,progress);
    },

    loadAll: function(){
        this.loadMaxNum = 0;
        this.loadedNum = 0;
        this.load("HouseConfig");
        this.load("BlockConfig");
        this.load("PreLoadConfig");
        this.load("DataConfig");
        return this.loadMaxNum;
    },

    load: function(filename)
    {
        var self = this;
        self.loadMaxNum += 1;
        //读取gamelist.json文件
        var url = "Config/" + filename;
        var _type = cc.RawAsset;
        //得到json文件内容
        cc.loader.loadRes(url, _type,function(err, res){
            if(!err){
                self.loadItems[filename] = res.json;
                self.loadedNum += 1;
                self.loadProgress();
            }
            else{
                self.loadMaxNum -= 1;
                self.load(filename);
                console.log("loadJson Failed:" + filename);
            }
            //这里获取res内容就是json里的内容
        });
    },

    getRowWithKV(k,v,configName)
    {
        var config = this.loadItems[configName];
        if(config){
            var i = 0;
            var o = null;
            for(i = 0; i < config.length; i++){
                o = config[i];
                if(o[k] == v)
                {
                    return o;
                }
            }
        }
        return null;
    }
};