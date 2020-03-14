
let Utils = require("Utils");
let WXHelp = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        img:cc.Sprite,
        label:cc.Label,
    },

    init (data) {
        this.data = data;
        Utils.createImage(window.SharePicUrl + data.appicon ,this.img);
        this.label.string = data.label;
    },

    btnClickNode:function(){
        WXHelp.navigateToMiniProgram(window.AppId[this.data.appid]);        
    },

});
