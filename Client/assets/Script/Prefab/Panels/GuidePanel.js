/*
 * @Author: your name
 * @Date: 2020-02-27 10:13:08
 * @LastEditTime: 2020-02-28 17:02:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Prefab\Panels\GuidePanel.js
 */
let CallBackHelp = require("CallBackHelp");
cc.Class({
    extends: cc.Component,

    properties: {
        img_hand: cc.Sprite,
        stencil: cc.Node,
        clickNode: cc.Node,
        labelNote: cc.Label,
        mask: cc.Node

    },

    start() {
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.DestroyGuide, function (param) {
            self.remove();
        }, self);
    },

    init: function (lv, node) {
        this.showNode = node;
        if (lv == 1) {
            this.labelNote.string = "拖动相同房子进行合并";
            this.lvOneAction();
        } else if (lv == 3) {
            this.labelNote.string = "点击快捷购买房子";
            this.lvThreeAction();
        }
        this.mask.on(cc.Node.EventType.TOUCH_START, function (event) {
            let pt = this.stencil.convertToNodeSpace(event.getLocation());
            let rect = cc.rect(0, 0, this.stencil.width, this.stencil.height);
            //点中空洞，返回false,触摸事件继续派发
            if (rect.contains(pt)) {
                this.mask._touchListener.setSwallowTouches(false);
            }
        }, this);
    },

    lvOneAction: function () {
        if (window.IsPhoneType == "pad") {
            this.img_hand.node.position = cc.p(-100, -140);
            this.stencil.position = cc.p(-35, -40);
            this.stencil.setContentSize(cc.size(180, 100));
            var action = cc.repeatForever(cc.sequence(
                cc.moveBy(0.4, 100, 0),
                cc.moveBy(0.4, -100, 0),
                cc.delayTime(0.5)
            ));
            this.img_hand.node.runAction(action);
        } else {
            this.img_hand.node.position = cc.p(-100, -100);
            this.stencil.position = cc.p(-50, -30);
            this.stencil.setContentSize(cc.size(220, 120));
            var action = cc.repeatForever(cc.sequence(
                cc.moveBy(0.4, 120, 0),
                cc.moveBy(0.4, -120, 0),
                cc.delayTime(0.5)
            ));
            this.img_hand.node.runAction(action);
        }

    },

    lvThreeAction: function () {
        // var _size = this.showNode.convertToWorldSpaceAR(cc.v2(0, 0));
        // console.error(_size, this.showNode.x, this.showNode.y);
        // let moveY = (1136 - cc.winSize.height) / 2;
        this.img_hand.node.x = 0;
        this.img_hand.node.y = -cc.winSize.height / 2 + 250 ; //+ moveY;
        this.stencil.x = 0;
        this.stencil.y = -cc.winSize.height / 2 + 100; //+ moveY;
        this.img_hand.node.rotation = 180;
        this.stencil.setContentSize(cc.size(302, 126));
        var action = cc.repeatForever(cc.sequence(
            cc.moveBy(0.35, 0, -40),
            cc.moveBy(0.35, 0, 40),
            cc.delayTime(0.5)
        ));
        this.img_hand.node.runAction(action);
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
    },

    remove: function () {
        this.img_hand.node.stopAllActions();
        this.node.destroy();
    }

});
