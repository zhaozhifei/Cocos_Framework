/*
 * @Description: 池节点可视化组件
 * @Author: mengjl
 * @LastEditors: mengjl
 * @Date: 2019-04-12 08:51:20
 * @LastEditTime: 2019-11-25 10:56:42
 */

let PoolDef = require('PoolDef')
let PoolManager = require('PoolManager')
// import PoolDef from './PoolDef'
// import PoolManager from './PoolManager'

cc.Class({
    extends: cc.Component,

    properties: {
        // poolName : {
        //     default : PoolDef.default,
        //     type : PoolDef,
        //     tooltip : '预制体池名字',
        //     visible() {
        //         return (this.custom == false);
        //     },
        // },
        __pool_name__ : {
            default: '', 
            tooltip : "Pool Name",
            visible : false,
        },

        poolNameEx : {
            default : '',
            visible() {
                return (this.custom == true);
            },
            displayName : 'Pool Name',
        },

        custom : {
            default : false,
            tooltip : '自定义poolName',
        },

        poolNum : {
            default : 1,
            type : cc.Integer,
            tooltip : '预制体池初始化数量',
            // serializable: true, 
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // console.log('name' + PoolDef[this.poolName]);
    },

    onDestroy()
    {
        // console.error('DialogBase onDestroy', this)
        PoolManager.removeUsedPerfab(this.getPoolName(), this.node);
    },

    getPoolName()
    {
        return this.__pool_name__;
    },

    setPoolName(pool_name)
    {
        this.__pool_name__ = pool_name;
    },

    start () {
        // console.log(this);
    },

    // update (dt) {},
});
