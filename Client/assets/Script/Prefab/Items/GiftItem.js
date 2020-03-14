/*
 * @Author: mengjl
 * @Date: 2020-02-10 20:00:15
 * @LastEditTime: 2020-02-24 10:56:02
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Items\GiftItem.js
 */
//礼盒
let PanelManager = require("PanelManager");
let AudioHelp = require("AudioHelp");
let Utils = require("Utils");
cc.Class({
    extends: cc.Component,

    properties: {
        icon_gift:cc.Sprite,
        baseImg:cc.SpriteAtlas,
        standBlock:null,
    },

    setStandBlock:function(block){
        this.standBlock = block;
        if(block){
            this.node.x = block.node.x;
            this.node.y = block.node.y;
        }
    },

    setData:function(type){
        this.node._type = type;
        if(type == 0){
            AudioHelp.playSimpleAudioEngine("dropmoney",0.7);
            this.icon_gift.spriteFrame = this.baseImg.getSpriteFrame("icon_gold");
        }else if(type == 1){
            AudioHelp.playSimpleAudioEngine("dropmoney",0.7);
            this.icon_gift.spriteFrame = this.baseImg.getSpriteFrame("icon_diamond");
        }else{
            AudioHelp.playSimpleAudioEngine("drophouse",0.7);
            this.icon_gift.spriteFrame = this.baseImg.getSpriteFrame("icon_houseBox");
        }

        var giftY = this.icon_gift.node.y;
        this.icon_gift.node.y = giftY + 50;

        var actiondrop = cc.sequence(
            cc.spawn(cc.moveTo(0.2,cc.v2(this.icon_gift.node.x,giftY)),cc.scaleBy(0.2,0.8,1.2)),
            cc.scaleBy(0.2,1.2,0.8),
            cc.scaleBy(0.2,0.9,1.1),
            cc.scaleBy(0.2,1,1),
            cc.delayTime(1.5),
            cc.callFunc(function(){
                Utils.shake(this.icon_gift.node);
            }.bind(this))
        );
        this.icon_gift.node.runAction(actiondrop); 
    },
    
    btnClickGift:function(event){
        var type = event.currentTarget._type;
        if(type == 0 || type == 1){
            AudioHelp.playSimpleAudioEngine("openmoneybox",0.7);
        }else{
            AudioHelp.playSimpleAudioEngine("openhousebox",0.7);
        }
        let component = PanelManager.openPanel(window.PrefabType.getGiftPanel);
        component.startAnim(type,this);
    },

    getSaveData(){
        return {block_id:this.standBlock.blockData.id, gift_type:this.node._type}
    },

    onDisable: function () {
        this.icon_gift.node.stopAllActions();
        this.node.targetOff(this);
    },

});

