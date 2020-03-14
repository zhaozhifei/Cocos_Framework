/*
 * @Author: mengjl
 * @Date: 2020-02-24 16:12:00
 * @LastEditTime: 2020-02-24 17:00:32
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogSure.js
 */

let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {

    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        this._callback = params.callback;
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    onClickYes()
    {
        if (this._callback) {
            this._callback(0);
        }
        this.closeDialog();
    },

    onClickNo()
    {
        if (this._callback) {
            this._callback(1);
        }
        this.closeDialog();
    },
});
