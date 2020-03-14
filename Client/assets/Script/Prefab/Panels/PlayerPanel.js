let BigNumber = require("BigNumber");
let CallBackHelp = require("CallBackHelp");
let Utils = require("Utils");
let WXHelp = require("WXHelp");
let AudioHelp = require("AudioHelp");

cc.Class({
    extends: cc.Component,

    properties: {
        btnEffect: cc.Button,
        btnMusic: cc.Button,
        baseImg: cc.SpriteAtlas,
        label_diamond: cc.Label,
        label_gold: cc.Label,
        label_produce: cc.Label,
        labelname: cc.Label,
        imgGender: cc.Sprite,
        img_userHead: cc.Sprite,

        labelUserId:cc.Label

    },

    start() {
        if (window.IsPhoneType == "pad") {
            this.node.scale = 0.7;
            this.node.getChildByName("layout").scale = 1.5;
        }
        let self = this;
        if (WXData.userInfo.avatarUrl) {
            cc.loader.load({ url: WXData.userInfo.avatarUrl, type: 'png' }, function (err, tex) {
                if (!err && self) {
                    let sp = self.img_userHead;
                    sp.spriteFrame = new cc.SpriteFrame(tex);
                    sp.type = cc.Sprite.Type.SIMPLE;
                    sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                    //再次设置node的Size
                    sp.node.width = 130;
                    sp.node.height = 130;
                }
            });
        }

        this.label_produce.string = BigNumber.getShowString(window.GameData.produce) + "/秒";
        CallBackHelp.addCall(window.CallBackMsg.ChangeProduce, function (param) {
            self.label_produce.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.produce) + "/秒";
        }, this);

        this.label_gold.string = BigNumber.getShowString(window.GameData.gold);
        CallBackHelp.addCall(window.CallBackMsg.ChangeGold, function (param) {
            self.label_gold.getComponent(cc.Label).string = BigNumber.getShowString(window.GameData.gold);
        }, this);

        this.label_diamond.string = window.GameData.diamond;
        CallBackHelp.addCall(window.CallBackMsg.ChangeDiamond, function (param) {
            self.label_diamond.getComponent(cc.Label).string = window.GameData.diamond;
        }, this);

        this.labelname.string = Utils.atobUserInfo(WXData.userInfo.nickName);
        var sfname = (WXData.userInfo.gender == 2) ? "icon_woman" : "icon_man";
        this.imgGender.spriteFrame = this.baseImg.getSpriteFrame(sfname);

        // add by Jack
        if (WXData.userInfo.gender == 2) {
            unit.ResMgr.replaceFrame(this.img_userHead, 'Images/UI/baseAtlas1', 'img_nv');
        } else {
            unit.ResMgr.replaceFrame(this.img_userHead, 'Images/UI/baseAtlas1', 'img_nan');
        }

        this.labelUserId.string = "ID:" +  window.SystemInfo.serverStringId;

        if (window.GameData.getIsMusic() == 1 || window.GameData.getIsMusic() == "1") {
            this.btnMusic.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_music_open');
        } else {
            this.btnMusic.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_music_close');
        }
        if (window.GameData.getIsEffect() == 1 || window.GameData.getIsEffect() == "1") {
            this.btnEffect.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_sound_open');
        } else {
            this.btnEffect.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_sound_close');
        }
    },

    btnClickShare: function () {
        WXHelp.shareGroup();
    },

    btnClickEffect: function () {
        if (window.GameData.isEffect == 1) {
            window.GameData.setIsEffect(0);
            this.btnEffect.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_sound_close');
        } else {
            window.GameData.setIsEffect(1);
            this.btnEffect.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_sound_open');
        }
    },

    btnClickMusic: function () {
        if (window.GameData.isMusic == 1) {
            window.GameData.setIsMusic(0);
            this.btnMusic.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_music_close');
            AudioHelp.stopAll();
        } else {
            window.GameData.setIsMusic(1);
            this.btnMusic.node.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame('icon_music_open');
            AudioHelp.playBackAudioEngine("game_bg");
        }
    },

    btnClickClose() {
        this.node.destroy();
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

});
