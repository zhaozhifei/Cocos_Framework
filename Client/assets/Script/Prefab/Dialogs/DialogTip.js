/*
 * @Author: mengjl
 * @Date: 2020-02-24 16:47:56
 * @LastEditTime: 2020-02-24 16:51:53
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogTip.js
 */

let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {
        lbl_desc : {
            default: null,
            type: cc.Label,
            tooltip : "遮罩透明度",
        },

    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        this.lbl_desc.string = params.text;

        let fadeOutAction = cc.sequence(
            cc.delayTime(1.5),
            cc.fadeOut(0.5),
            cc.removeSelf());
        this.node.runAction(fadeOutAction);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},
});
