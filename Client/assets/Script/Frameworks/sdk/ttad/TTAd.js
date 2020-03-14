/*
 * @Author: mengjl
 * @Date: 2019-12-22 16:22:31
 * @LastEditTime : 2020-01-15 18:58:06
 * @LastEditors  : mengjl
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\sdk\ttad\TTAd.js
 */

let SDKBase = require("SDKBase")

cc.Class({
    extends: SDKBase,

    properties: {
        sdk_name : {
            default: 'ttad',
            tooltip : "SDK名字",
            override : true,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init()
    {
        unit.SDKMgr.onRegisterCallback('ttLoadRewardVideoAd', 'V', 'unit.SDKMgr.getSDK(\'ttad\').loadRewardVideoAd');
        unit.SDKMgr.onRegisterCallback('ttRewardAdInteraction', 'V', 'unit.SDKMgr.getSDK(\'ttad\').rewardAdInteraction');
        unit.SDKMgr.onRegisterCallback('ttLoadInteractionAd', 'V', 'unit.SDKMgr.getSDK(\'ttad\').loadInteractionAd');
        unit.SDKMgr.onRegisterCallback('ttLoadBannerAd', 'V', 'unit.SDKMgr.getSDK(\'ttad\').loadBannerAd');
        unit.SDKMgr.onRegisterCallback('ttLoadFeedAd', 'V', 'unit.SDKMgr.getSDK(\'ttad\').loadFeedAd');
    },

    loadRewardVideoAd(errCode)
    {
        unit.error('loadRewardVideoAd', errCode);
        if (errCode == 0) {
            unit.SDKMgr.callTTADMethod('playRewardAd', 'V');
        }
    },

    rewardAdInteraction(key, ...params)
    {
        unit.error('rewardAdInteraction', key, ...params);
        unit.EventDispatcher.dispatch('rewardAdInteraction', {key : key, params : params});
        if (key == 'close') {
            uLogic.UserMgr.setLocalData('look_ad_time', uLogic.UserMgr.getServerTime());
        }
    },

    loadInteractionAd(errCode, msg)
    {
        unit.error('loadInteractionAd', errCode, msg);
    },

    loadBannerAd(errCode, msg)
    {
        unit.error('loadBannerAd', errCode, msg);
    },

    loadFeedAd(key, ...params)
    {
        unit.error('loadFeedAd', key, ...params);
    },
});
