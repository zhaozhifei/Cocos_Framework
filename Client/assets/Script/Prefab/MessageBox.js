let Utils = require("Utils");
let WXHelp = require("WXHelp"); 
cc.Class({
    extends: cc.Component,

    properties: {
        btnOther:cc.Button,
        btnConfirm:cc.Button,
        btnNoThanks:cc.Button,
        btnConSpr:cc.Sprite,
        btnOthSpr:cc.Sprite,
        baseImg:cc.SpriteAtlas,
        imgShowHouse:cc.Sprite,

        gameNode:cc.Node,
    },

    onLoad(){
        this.setOtherGameShow();
    },
    
    setTitle(isShow) {
        if(isShow){
            this.node.getChildByName("bg_title").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.word_jinbibuzu);
            this.node.getChildByName("label_desc").color = cc.color(1,78,8);
        }else{
            this.node.getChildByName("bg_title").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.word_tip);
            this.node.getChildByName("label_desc").color = cc.color(0,0,0);
        }
    },

    setDesc(desc,showHouseSpr,isShowGold) {
        this.node.getChildByName("ico_glod").active = false;
        if(showHouseSpr){
            this.node.getChildByName("label_desc").getComponent(cc.Label).string = desc;
            this.imgShowHouse.spriteFrame = showHouseSpr;
            this.node.getChildByName("label_desc").y = -60;
        }else{
            if(isShowGold){
                this.node.getChildByName("ico_glod").active = true;
                this.node.getChildByName("label_desc").y = -60;
            }

            this.imgShowHouse.node.active = false;
            this.node.getChildByName("label_desc").getComponent(cc.Label).string = desc;
        }
    },

    setBtnSpr:function(spr1,spr2){
        let self = this;
        if(spr1 == window.MessageBoxSpr.RedDelete && spr2 == window.MessageBoxSpr.YellowCancel){
            this.node.getChildByName("label_desc").y = 20;
            this.node.getChildByName("label_dele").y = -50;
            this.node.getChildByName("label_dele").active = true;
        }

        this.btnNoThanks.node.active = false;
        if(spr2 == window.MessageBoxSpr.Word_FanBei ){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
            this.scheduleOnce(function(){
                self.btnNoThanks.node.active = true;
            },window.ShowTime)
        }else if((spr1 == window.MessageBoxSpr.GreenOk && spr2 == window.MessageBoxSpr.GreenOk)){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
        }else if(spr2 == window.MessageBoxSpr.Word_LingQu){
            this.btnConfirm.node.active = false;
            this.scheduleOnce(function(){
                self.btnNoThanks.node.active = true;
            },window.ShowTime)
            this.btnOther.node.x = 0;
        }else if(spr2 == window.MessageBoxSpr.word_xuanyao){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
        }else if(spr2 == window.MessageBoxSpr.SeeVideo){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
            this.scheduleOnce(function(){
                self.btnNoThanks.node.active = true;
            },window.ShowTime)
        }
        else if(spr2 == window.MessageBoxSpr.word_seex5){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
            this.scheduleOnce(function(){
                self.btnNoThanks.node.active = true;
            },window.ShowTime)
        }
        else if(spr2 == window.MessageBoxSpr.word_seex10){
            this.btnConfirm.node.active = false;
            this.btnOther.node.x = 0;
            this.scheduleOnce(function(){
                self.btnNoThanks.node.active = true;
            },window.ShowTime)
        }
        else{
            this.btnConfirm.node.active = true;
            this.btnOther.node.x = 120;
        }

        if(spr2 == window.MessageBoxSpr.YellowCancel){
            this.btnOther.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnYellow);
        }else if(spr2 == window.MessageBoxSpr.Share || spr2 == window.MessageBoxSpr.GreenOk || spr2 == window.MessageBoxSpr.Word_FanBei){
            this.btnOther.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnGreen);
        }else if(spr2 == window.MessageBoxSpr.SeeVideo){
            this.btnOther.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnBlue);
        }

        if(spr1 == window.MessageBoxSpr.Share || spr1 == window.MessageBoxSpr.GreenOk){
            this.btnConfirm.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnGreen);
        }else if(spr1 == window.MessageBoxSpr.SeeVideo){
            this.btnConfirm.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnBlue);
        }else if(spr1 == window.MessageBoxSpr.RedDelete){
            this.btnConfirm.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(window.MessageBoxSpr.BtnYellow);
        }
    },

    setBtnLabelSpr:function(sprN1,sprN2){
        this.btnConSpr.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(sprN1);
        this.btnOthSpr.node.getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(sprN2);
        this.setBtnSpr(sprN1,sprN2);

        this.btnOthSpr.node.sprName = sprN2;
    },   

    setCallBackOther(func){
        this.callBackOther = func;
    },

    setCallBackConfirm(func){
        this.callBackConfirm = func;
    },

    setCloseFunc(func){
        this.closeFunc = func;
    },

    btnClickConfirm(){
        this.callBackConfirm();
        this.node.destroy();
    },

    btnClickOther(){
        this.callBackOther();
        if(this.btnOthSpr.node.sprName != window.MessageBoxSpr.Word_FanBei && this.btnOthSpr.node.sprName != window.MessageBoxSpr.Word_LingQu && this.btnOthSpr.node.sprName != window.MessageBoxSpr.SeeVideo
            && this.btnOthSpr.node.sprName != window.MessageBoxSpr.word_seex5 && this.btnOthSpr.node.sprName != window.MessageBoxSpr.word_seex10){
            this.node.destroy();
        }
    },

    btnClickNoThanks:function(){
        this.callBackConfirm();
        this.node.destroy();
    },

    btnClickClose(){
        this.closeFunc();
        this.node.destroy();
    },

    setOtherGameShow:function(){
        let img1 = this.gameNode.getChildByName("node1").getChildByName("spr1").getComponent(cc.Sprite);
        let img2 = this.gameNode.getChildByName("node2").getChildByName("spr2").getComponent(cc.Sprite);
        let img3 = this.gameNode.getChildByName("node3").getChildByName("spr3").getComponent(cc.Sprite);
        Utils.createImage(window.SharePicUrl + "appicon/yibihuazhu.png" ,img1);
        Utils.createImage(window.SharePicUrl + "appicon/zhuawaw.png" ,img2);
        Utils.createImage(window.SharePicUrl + "appicon/tanqiu.png" ,img3);
    },

    btnClickNode:function(event){
        if(event.target.name == "node1"){
            WXHelp.navigateToMiniProgram(window.AppId[4]);  
        }else if(event.target.name == "node2"){
            WXHelp.navigateToMiniProgram(window.AppId[2]);  
        }else{
            WXHelp.navigateToMiniProgram(window.AppId[3]);  
        }
    }
});
