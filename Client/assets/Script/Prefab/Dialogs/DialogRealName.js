/*
 * @Author: mengjl
 * @Date: 2020-02-24 14:39:44
 * @LastEditTime: 2020-02-24 15:16:34
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogRealName.js
 */
let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {
        lbl_text : {
            default: null,
            type: cc.Label,
            tooltip : "遮罩透明度",
        },
    },

    onLoad () {
        
    },

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },
});
