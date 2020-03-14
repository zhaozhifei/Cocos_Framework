/*
 * @Author: mengjl
 * @Date: 2020-02-24 10:21:37
 * @LastEditTime: 2020-02-24 10:43:30
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Scene\AdviceScene.js
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scheduleOnce(()=>{
            cc.director.loadScene('MainScene');
        }, 3);
    },

    // update (dt) {},
});
