/*
 * @Author: mengjl
 * @Date: 2020-02-24 14:39:44
 * @LastEditTime: 2020-02-26 17:21:48
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogProtocol.js
 */
let DialogBase = require("DialogBase")

cc.Class({
    extends: DialogBase,

    properties: {
        lbl_text : {
            default: null,
            type: cc.RichText,
            tooltip : "遮罩透明度",
        },
        json_assert : {
            default: null,
            type: cc.Asset,
            tooltip : "遮罩透明度",
        },
    },

    onLoad () {
        
    },

    start () {
        console.error(this.json_assert);
    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');

        this.setText(params.type);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    setText(type)
    {
        var text = this.getDesc(type);
        // console.error(text);
        this.lbl_text.string = text;
    },

    getDesc(type)
    {
        var text = '';
        for (let index = 0; index < this.json_assert.json[type].length; index++) {
            const element = this.json_assert.json[type][index];
            text += (element + '<br/>');
        }
        return text;
    },
});
