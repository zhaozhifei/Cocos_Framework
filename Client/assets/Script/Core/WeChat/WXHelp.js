let HttpHelp = require("HttpHelp")
let Utils = require("Utils");
let LoadManager = require("LoadManager");

module.exports = {
    //系统信息
    wxsys_info: null,
    //游戏圈
    GameClubBtn: null,
    //登陆按钮
    LoginBtn: null,
    btnNode: null,
    progressBar: null,
    bannerArr: new Array(),

    initThis: function (btnNode, progressBar) {
        // wx.getStorage({
        //     key: window.StorageKey.GameVesion,
        //     success(res) {
        //         console.log(res.data)
        //         if (res.data != window.game_vesion) {
        //             wxDownloader.cleanAllAssets();
        //             wx.setStorage({
        //                 key: window.StorageKey.GameVesion,
        //                 data: window.game_vesion
        //             })
        //         }
        //     }
        // })

        this.btnNode = btnNode;
        this.progressBar = progressBar;
        this.wxsys_info = window.wx.getSystemInfoSync();
        console.log("--wxsys_info--->", this.wxsys_info);

        if ((this.wxsys_info.windowHeight / this.wxsys_info.windowWidth) < (1136 / 640)) {
            window.IsPhoneType = "pad";
        } else {
            window.IsPhoneType = "phone";
        }

        this.getUserInfo();

    },

    wxLogin: function () {
        let self = this;
        wx.login({
            success: function (res) {
                if (res.code) {
                    WXData.code = res.code;
                    self.serverLogin();
                    self.btnNode.active = false;
                    self.progressBar.node.active = true;
                    self.progressBarMain();
                } else {
                    self.progressBar.node.active = false;
                    self.getUserInfo();
                    if (self.LoginBtn) {
                        self.LoginBtn.show();
                    }
                    console.log('登录失败！' + res.errMsg)
                }
            }
        });
    },


    progressBarMain: function () {
        let self = this;
        var num = 0;
        this.timer = setInterval(function () {
            num += 10;
            self.progressBar.progress = (num / 100 >= 1) ? 1 : num / 100;
        }, 500);
    },

    serverLogin: function () {
        let self = this;
        if (!WXData.inviteId || WXData.inviteId  == "" || WXData.inviteId  == "null" || WXData.inviteId  == "undefined") {
            WXData.inviteId = 0;
        }
        let userinfo = Utils.btoaUserInfo(WXData.userInfo);
        let md5str = Utils.setUserDataToMd5(userinfo);
        var parmes = {};
        // if(window.ServerStorage.getUserInfoDif(md5str)){
        //     parmes = {
        //         code: WXData.code,
        //         rawData: userinfo,
        //         inviteId: WXData.inviteId,
        //         Platform:window.Platform
        //     };
        // }else{
        parmes = {
            code: WXData.code,
            rawData: userinfo,
            inviteId: WXData.inviteId,
            Platform: window.Platform,
            md5: md5str
        };
        // }
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.Oauth;

        HttpHelp.httpPost(url, parmes, function (res) {
            if (res && res.errcode == 0) {
                window.ServerStorage.saveStart(res.userid);
                window.ServerStorage.getHasRewardList(res.userid);
                window.ServerStorage.readSetting();
                window.GameData.setRegTime(res.regtime);
                if (self.LoginBtn) {
                    self.LoginBtn.hide();
                }
                self.progressBar.node.active = false;
                clearInterval(self.timer);
            } else {

                if (self.LoginBtn) {
                    self.LoginBtn.show();
                } else {
                    self.showWxBtn(self.btnNode);
                }
                self.btnNode.active = true;
                self.progressBar.node.active = false;
                clearInterval(self.timer);

                self.showWXTips("登录", "登录失败，请重新尝试！");
            }
        })
    },

    aboutShare: function () {
        //右上角分享显示
        wx.showShareMenu({
            withShareTicket: true
        });

        var con = this.getShareCon();
        wx.onShareAppMessage(function () { //被动转发
            return {
                title: con[0],
                query: "serverStringId=" + window.SystemInfo.serverStringId,
                imageUrl: window.SharePicUrl + con[1],
            }
        });

        //更新转发属性
        wx.updateShareMenu({
            withShareTicket: true
        });

        var res = wx.getLaunchOptionsSync();
        this.saveInvite(res);

        wx.onShow(function (res) {
            this.saveInvite(res);
        }.bind(this));
    },

    saveInvite: function (res) {
        if (res.query) {
            WXData.inviteId = res.query.serverStringId;
        }
    },

    //微信提示
    showWXTips: function (_title, _content) {
        window.wx.showModal({ title: _title, content: _content, showCancel: false });
    },

    //客服
    openCustomerServiceConversation: function () {
        window.wx.openCustomerServiceConversation({});
    },

    //分享不同群
    shareAppMessageDiffGroup: function (callFun) {
        this.shareGroup();
        callFun();
    },

    shareGroup: function () {
        var con = this.getShareCon();
        window.wx.shareAppMessage({
            title: con[0],
            query: "serverStringId=" + window.SystemInfo.serverStringId,
            imageUrl: window.SharePicUrl + con[1],
        });
    },

     // ["晚上一人去收房租，没想到竟然……", LoadManager.getUrlWithKey(4003)]
     // ["哎呀！收租太忙，我都忘记我在迪拜有套房子了！", LoadManager.getUrlWithKey(4006)],
     // ["今日分离是为了日后更美的相遇，看女屌丝逆袭成亿万富豪... ", LoadManager.getUrlWithKey(4008)],
    // ["包租婆！怎么又没水了？？？！！！！", "shareCount/img_sloganone.png"],
    getShareCon: function () {
        var conArr = [];
        var index = 0;
        if(window.GameData.shenhe == false){
            conArr = [["我大爷给我留了一套房产，竟然价值百万！", "shareCount/img_uploadpic.png"],
            ["你要把这辆兰博基尼停在哪个车库呢？", "shareCount/img_sloganthree.png"],
            ["突然有一天，我爸拿出一堆红本子和我说……", "shareCount/img_sloganfour.png"],
            ["隔壁王大妈为何尖叫连连……", "shareCount/img_slogansix.png"],
            ];
            index = Utils.random(3, 0);
        }else{
            conArr = [["我大爷给我留了一套房产，竟然价值百万！", "shareCount/shenhe1.png"],
            ["你要把这辆兰博基尼停在哪个车库呢？", "shareCount/shenhe2.png"],
            ];
            index = Utils.random(1, 0);
        }
        return conArr[index];
    },

    //游戏圈
    GameClubHide: function () {
        this.GameClubBtn.hide();
    },
    GameClubShow: function () {
        this.GameClubBtn.show();
    },

    getUserInfo: function () {
        let self = this;
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        lang: "zh_CN",
                        success: function (res) {
                            console.log(res.userInfo)
                            WXData.userInfo = res.userInfo;
                            self.wxLogin();
                        }
                    })
                }
                else {
                    console.log("未授权" + JSON.stringify(res));
                    self.showWxBtn(self.btnNode);
                }
            }
        })
    },

    showWxBtn: function (btnNode) {
        let self = this;
        btnNode.active = true;
        let btnSize = cc.size(btnNode.width + 20, btnNode.height + 50);
        let winSize = cc.director.getWinSize();

        let moveY = (1136 - winSize.height) / 2 + 30;

        //适配不同机型来创建微信授权按钮
        let left = (winSize.width * 0.5 + btnNode.x - btnSize.width * 0.5) / winSize.width * self.wxsys_info.windowWidth;
        let top = ((winSize.height * 0.5 - btnNode.y - btnSize.height * 0.5) / winSize.height * self.wxsys_info.windowHeight) - moveY;
        let width = btnSize.width / winSize.width * self.wxsys_info.windowWidth;
        let height = btnSize.height / winSize.height * self.wxsys_info.windowHeight;

        self.LoginBtn = wx.createUserInfoButton({
            lang: "zh_CN",
            type: 'text',
            text: "",
            style: {
                left: left, // self.wxsys_info.windowWidth * 0.25,
                top: top,//self.wxsys_info.windowHeight * 0.75,
                width: width, //self.wxsys_info.windowWidth * 0.5,
                height: height, //self.wxsys_info.windowWidth * 0.125,
                lineHeight: self.wxsys_info.windowWidth * 0.1,
                backgroundColor: '',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: self.wxsys_info.windowWidth * 0.05,
                borderRadius: 4
            }
        })

        self.LoginBtn.onTap(function (res) {
            console.log(res)
            WXData.encryptedData = res.encryptedData;
            WXData.iv = res.iv;
            WXData.rawData = res.rawData;
            WXData.signature = res.signature;
            WXData.userInfo = res.userInfo;
            self.wxLogin();
        })
    },

    //创建banner
    userBanner:function(unitId){
        var o = null;
        for(var i = 0;i<this.bannerArr.length;i++){
            if(this.bannerArr[i].type == unitId){
                o = this.bannerArr[i].banner;
            }
        }
        if(o){
            return o;
        }else{
            return this.createBanner(unitId);
        }
    },

    createBanner:function(unitId){
        let bannerAd = wx.createBannerAd({
            adUnitId: unitId,
            style: {
                left: (this.wxsys_info.windowWidth - 320) /2,
                top: this.wxsys_info.windowHeight - this.wxsys_info.windowWidth / 320 * 96,
                width: 320,
                height: this.wxsys_info.windowWidth / 320 * 96,
            }
        })
        bannerAd.show().then(() => console.log('banner 广告显示'))
        bannerAd.onLoad(() => {
            console.log('banner 广告加载成功')
        })

        bannerAd.onError(err => {
            console.log("--失败-->", err);
            return null;
        })
        bannerAd.show().catch(err => {
            console.log("--失败-->", err);
            return null;
        })
        // this.bannerArr.push({"type":unitId,"banner":bannerAd});
        window.GameData.banner = bannerAd;
        window.GameData.setBannerCount(1);
        return bannerAd;
    },

    //创建视频
    createVideo:function(unitId,success,fail,closeFun){
        window.GameData.banner.hide();
        window.GameData.isSeeVideo = true;
        this.success = success;
        this.fail = fail;
        this.closeFun = closeFun;
        let videoAd = wx.createRewardedVideoAd({
            adUnitId: unitId
        });
        videoAd.load().then(() => videoAd.show()).catch(err => {
            console.log(err.errCode + err.errMsg);
            // Utils.showTips("看视频过于频繁，已为您跳转分享...");
            window.GameData.banner.show();
            window.GameData.isSeeVideo = false;
        })
        videoAd.onError((err)=>{
            console.log(err.errCode + err.errMsg);
            //Utils.showTips("跳转分享...");
            window.GameData.banner.show();
            window.GameData.isSeeVideo = false;
            if(this.fail){
                this.fail();
                this.fail = null;
            }
        })
        videoAd.onClose(res => {
            window.GameData.banner.show();
            window.GameData.isSeeVideo = false;
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                if(this.success){
                    this.success();
                    this.success = null;
                }
            }else {
                console.log('---退出-->');
                // 播放中途退出，不下发游戏奖励
                if(this.closeFun){
                    this.closeFun();
                    this.closeFun = null;
                }
            }
        });
    },

    //跳转小程序
    navigateToMiniProgram:function(appId){
        wx.navigateToMiniProgram({
            appId: appId,
            success(res) {
                console.log("--调转成功--");
            },
            fail(res) {
                console.log("---调转失败--",res);
            },
          })
    },

};