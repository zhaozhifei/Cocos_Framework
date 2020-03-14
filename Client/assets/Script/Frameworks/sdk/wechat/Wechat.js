/*
 * @Author: mengjl
 * @Date: 2019-12-21 14:02:46
 * @LastEditTime : 2019-12-26 18:01:13
 * @LastEditors  : mengjl
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\sdk\wechat\Wechat.js
 */

let SDKBase = require("SDKBase")

cc.Class({
    extends: SDKBase,

    properties: {
        sdk_name : {
            default: 'wechat',
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
        unit.SDKMgr.onRegisterCallback('wxLoginCallback', 'V', 'unit.SDKMgr.getSDK(\'wechat\').loginCallback');
        unit.SDKMgr.onRegisterCallback('wxShareCallback', 'V', 'unit.SDKMgr.getSDK(\'wechat\').shareCallback');
    },

    loginCallback(errCode)
    {
        // uLogic.GameMgr.hideLoading();
        unit.error('loginCallback', errCode);
        if (errCode == 0) {
            // unit.SceneMgr.loadingScene('Hall');
            var code = unit.SDKMgr.callWechatMethod('getCode', 'S');
            unit.error('getCode', code);
            uLogic.LoginMgr.loginGameThird(code);
        }
        else
        {
            uLogic.GameMgr.hideLoading();
            unit.error('微信登录失败！');
        }
        
    },

    shareCallback(errCode, openId)
    {
        unit.error('shareCallback', errCode, openId);
    },

    getUserInfo(access_token, openid, callback) {       
        //获取用户信息
        /* {"openid":"oWVFrwqr5i1FP2jYKzb3chy0staM",
            "nickname":"毕加索3767😍 😓 😏 😓 44",
            "sex":0,
            "language":"zh_CN",
            "city":"",
            "province":"",
            "country":"",
            "headimgurl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Ks330bic6cT4ab45BlkIQR3u3PcmaCuptdnRLiahf1tnPRD8u7Uzy7Ru48Via2SFVPFvicTnx2NG6Lgvwdia1bMia07Q/132",
            "privilege":[],
            "unionid":"o8KVN02dRaQqREThZeG49gdTSRaQ"}
        */
        var url = uConfig.wechatUserinfoUrl + 'access_token=' + access_token + '&openid=' + openid;

        unit.IHttp.get(url, (resp)=>{
            if (resp == null) {
                return;
            }
            unit.log('getUserInfo', JSON.stringify(resp));
            if (callback) {
                callback(resp);
            }
        });
    },
});
