/*
 * @Author: mengjl
 * @Date: 2020-02-10 20:00:15
 * @LastEditTime: 2020-02-27 10:19:23
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Scene\LoadScene.js
 */
let JsonConfig = require("JsonConfig");
let CallBackHelp = require("CallBackHelp");
let LoadManager = require("LoadManager");

cc.Class({
    extends: cc.Component,

    properties: {
        progressNode:{
            default: null,
            type: cc.ProgressBar,
        },
        labelNode:{
            default: null,
            type: cc.Label,
        },
    },

    //1
    onLoad () {

    },
    //2
    start () {
        this.begin_load();
    },
    
    //3
    onDestroy(){

    },

    //1
    onEnable(){

    },
    //2
    onDisable(){
        CallBackHelp.removeCallByTarget(this);
    },
    
    //1
    update (dt) {

    },
    //2
    lateUpdate: function (dt) {

    },

    
    begin_load:function(){
        this.loadConfig();
        this.loadConfigForServer();
    },

    loadConfigForServer:function(){
        cc.loader.load(window.SharePicUrl + "config.json",(err, res)=>{
            console.log('--shenhe-->',res);
            if(!err){
                window.GameData.shenhe = res.shenhe;
            }
            else{
            //    this.loadConfigForServer();
            }
        });
    },

    loadConfig:function(){
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.JsonConfigLoadProgress,function(param){
            self.progressNode.progress = param;
            self.labelNode.string = "正在加载配置表" + Math.floor(param * 100) + "%";
            if(param == 1){
                self.loadImages();
            }
        },this);
        JsonConfig.loadAll();
    },

    loadImages:function(){
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.ImageLoadProgress,function(param){
            self.progressNode.progress = param;
            self.labelNode.string = "正在加载资源" + Math.floor(param * 100) + "%";
            if(param == 1){
                self.loadEnd();
            }
        },this);
        LoadManager.loadAll();
    },

    loadEnd:function(){
        cc.director.preloadScene('HallScene',function(){
            cc.director.loadScene('HallScene');
            window.SystemInfo.isLoaded = true;
        });    
    }
});
