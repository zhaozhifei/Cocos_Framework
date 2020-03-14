let Utils = require("Utils");
let JsonConfig = require("JsonConfig");
let HttpHelp = require("HttpHelp");
let WXHelp = require("WXHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        btnInvite:cc.Button,
        labelContent:cc.Label,
        inviteBar:cc.ProgressBar,
        labelInvite:cc.Label,
        baseImg:cc.SpriteAtlas
    },
    init:function(data,type){
        if(type == "invite"){
            this.showInviteContent(data);
        }
    },

    showInviteContent:function(data){
        this.btnInvite.node.active = true;
        this.labelContent.string = data.label;
        if(parseInt(window.GameData.share) > parseInt(data.inviteNum)){
            this.inviteBar.progress = 1;
        }else{
            this.inviteBar.progress = window.GameData.share / data.inviteNum;
        }

        if(parseInt( window.GameData.share) >= parseInt(data.inviteNum)){
            this.labelInvite.string = data.inviteNum + "/" + data.inviteNum;   
        }else{
            this.labelInvite.string = window.GameData.share + "/" + data.inviteNum;   
        }
           
        this.btnInvite.data = data;

        if(data.count > 0){
            this.btnInvite.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("btn_yilingqu");
            this.btnInvite.interactable = false;
        }else{
            this.btnInvite.interactable = true;
            if(parseInt(window.GameData.share) >= parseInt(data.inviteNum)){
                this.btnInvite.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("btn_lingqu");
                this.btnInvite._type = "get";
            }else{
                this.btnInvite.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame("btn_invite");
                this.btnInvite._type = "invite";
            }
        }
    },

    btnClickInvite:function(){ 
        let self = this;
        if(this.btnInvite._type == "invite"){
            WXHelp.shareGroup();
        }else{
            var data = this.btnInvite.data;
            var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.getReward;
            var parmes = {
                userid : window.SystemInfo.serverStringId,
                buffid : data.id,
            };
            HttpHelp.httpPost(url,parmes,function(res){
                if(res && res.errcode == 0){
                    let inviteData = JsonConfig.loadItems.DataConfig.InviteData;
                    var rewardData = inviteData[data.id - 1];
                    self.btnInvite.node.getComponent(cc.Sprite).spriteFrame = self.baseImg.getSpriteFrame("btn_yilingqu");
                    self.btnInvite.getComponent(cc.Button).interactable = false;
                    if(rewardData.diamond){
                        var diamond = parseInt(window.GameData.diamond) + rewardData.diamond;
                        window.GameData.setDiamond(diamond);
                        Utils.showMessageBox(false, true, "获得" + rewardData.diamond+ "钻石", function () {},function () {} ,function(){}, window.MessageBoxSpr.GreenOk, window.MessageBoxSpr.GreenOk);
                    }else if(rewardData.time){
                        window.GameData.setAddedTimesTick(parseInt(window.GameData.addedTimesTick) + rewardData.time);
                    }else{
                        //长按合并
                        window.GameData.setIsHaveLongClick(1);
                    }
                }else {
                    WXHelp.showWXTips("提示", "网络异常，请稍后重试！");
                }
            })
        }
    },

});
