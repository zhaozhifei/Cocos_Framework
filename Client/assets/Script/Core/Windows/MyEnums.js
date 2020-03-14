window.CallBackMsg= {
    JsonConfigLoadProgress : "JsonConfigLoadProgress",
    ImageLoadProgress : "ImageLoadProgress",
    TouchendHouse: "TouchendHouse",
    ChangeShare: "ChangeShare",
    ChangeLevel: "ChangeLevel",
    ChangeGold: "ChangeGold",
    ChangeProduce: "ChangeProduce",
    ChangeDiamond: "ChangeDiamond",
    ChangeBuyCount: "ChangeBuyCount",
    ChangeTimesTick: "ChangeTimesTick",
    ChangeGiftTime: "ChangeGiftTime",
    ClickGift: "ClickGift",
    ChangeDrakRewardCount: "ChangeDrakRewardCount",
    DestroyGuide: "DestroyGuide",
    ChangeCurSginTime: "ChangeCurSginTime",
    ChangeShopShareCount: "ChangeShopShareCount",
    MoveHouse: "MoveHouse",
    TouchStartHouse:"TouchStartHouse",
    // CreateHouseForVideo: "CreateHouseForVideo",

    BuyHouse: "BuyHouse",
    BuyHouseByDiamond: "BuyHouseByDiamond",
    CreateHouse: "CreateHouse",
    AddTipsShow: "AddTipsShow",
    CreateHouseForGift: "CreateHouseForGift",
    CheckNewDay: "CheckNewDay",

    ChangeOwnerChatTime: "ChangeOwnerChatTime",
    ClickBaoZuPo: "ClickBaoZuPo",
};
    
window.StorageKey = {
    StorageVersion : "StorageVersion",
    ServerStringId : "ServerStringId",
    GameData : "GameData",
    Md5UserInfo : "Md5UserInfo",
    IsEffect : "IsEffect",
    IsMusic : "IsMusic",
    ShareCount : "ShareCount",
    BannerCount : "BannerCount",
};
    
window.PrefabType = {
    MessageBox: 1,
    TipsShow: 2,
    Ef_Add: 3,

    MapBlock: 1001,
    HouseItem: 1002,
    ShopItem: 1003,
    RankItem: 1004,
    BaseItem: 1005,
    GiftItem: 1006,
    OtherGameItem: 1007,

    ShopPanel: 2001,
    PlayerPanel: 2002,
    RankPanel: 2003,
    InvitePanel: 2004,
    getGiftPanel: 2005,
    Guide: 2006,
    Plane: 2007,
    Decoration: 2008,
    OwnerChat: 2009,
    SignNode: 2010,
    OtherGame: 2011,
    jiasuPanel: 2012,

};

window.ServerFuncUrl = {
    // Base: "https://lgd.52guandan.com:32101/",//测试服
    Base: "http://106.14.59.112:32101/", //测试服1

    // Base: "https://mini.51v.cn:32101/",  //正式服1
    // Base: "https://mini.51v.cn:32102/",  //正式服
    
    Register: "GameBaoZuPo/BzpByRegister",
    Oauth: "GameBaoZuPo/LoginWX",
    SaveStorage: "GameBaoZuPo/SaveGameInfoData",
    ServerTime: "GameBaoZuPo/GetSysTime", 
    checkShareNum: "GameBaoZuPo/UpdateReward", 
    GetStorage: "GameBaoZuPo/GetGameInfoData",
    InviteList: "GameBaoZuPo/GetBuffList", 
    getReward: "GameBaoZuPo/UpdateBuff",  
    WorldTop: "GameBaoZuPo/GetRankingList", 
    GetHasRewardList: "GameBaoZuPo/GetHasRewardList", 

    ReadSetting: "GameBaoZuPo/ReadSetting", 
};

//弹框文字资源
window.MessageBoxSpr = {
    GreenOk:"word_queding",
    RedDelete:"word_delete", 
    YellowCancel:"word_quxiao",
    Share:"word_share",
    SeeVideo:"word_video",
    BtnGreen:"btn_green",
    BtnBlue:"btn_blue",
    BtnYellow:"btn_yellow",
    
    BlueInvite:"word_invite",  
    BlueLvAddOne:"word_lv1",
    GreenLvAddOne:"word_lv1",

    Word_FanBei:"word_fanbei",
    Word_LingQu:"word_lingqu",

    word_tip:"word_tip",
    word_jinbibuzu:"word_goldbuzu",
    word_xuanyao:"webzi-xuanyao",
    word_seex5:"word_seex5",
    word_seex10:"word_seex10",
}

window.ShareOrSeeVideo = {
    Gold_Chests :"gold_chests",  //金币宝箱 
    Monster_Chests:"monster_chests", //房子宝箱
    Store_Monster:"store_monster",  //商店分享购买房子 //签到 进阶
    Speed_Up:"speed_up",  //分享加速 
    Diamond_Chests:"diamond_chests",  //钻石不足弹框或钻石宝箱
    Store_Video_Monster:"store_video_monster",  //商店看视频获得房子
    Video_Speed_Up:"video_speed_up" , //看视频加速

    GoldTips:"goldtipcount" , //金币不足
    OwnerChat:"ownerchatcount"  ,//包租婆
    OfflineGold:"offlinegold"  ,//离线金币
    DelayConfirm:"delayconfirm"  ,//分享的延迟时间

    OfflineGoldReward:"offlinegoldreward"  ,//离线金币系数
    OwnerReward:"offlineownerreward"  ,//包租婆的金币系数
}
window.RewardSetting = {
    OfflineGold :"offline", //离线金币
    GoldTips :"dibao",      //金币不足
    GoldChests :"house",    //金币礼盒
    SpeedUp :"speed",       //加速
    ShopVideo :"ShopVideo", //商店看视频获得房子
}

window.curShareType = "";

window.secretkey = "eqM3ASPGyFIgswGk";  //key
window.Platform  =  "mini_wechat_0001";  //平台信息
window.SharePicUrl = "https://down.51v.cn/MiniGames/baozupo/" //分享图片的url  审核参数

window.ShowTime = 1.5;  //显示 ”不用谢谢“ 的时间

window.diamondTime = 60;  //换钻石的时间
window.shareTime = 200;   //分享加速的时间

//开放等级
window.OpenLevel = {
    JinBiBaoXiang : 8,
    ZuanShiBaoXiang: 8,
    FangZiBaoXiang: 8,

    BaoZuPo:8,
    ZhuangXiuJinJie:15,

    PaiHangPang:1,
    ShangDian:1,
    YaoQing:1
}


window.BannerVedioId = {
    MainBanner :"adunit-27f00025355a92c2",
    SetBanner :"adunit-cb4a2f634ebad9f9",
    SignBanner :"adunit-c456b06335bd4dc8",
    ShopBanner :"adunit-d0da168d09ebea41",
    RankBanner :"adunit-f7e193a5a3684fcd",
    InviteBanner :"adunit-6d74d0ce9f16698d",
    OwnerChatBanner :"adunit-245919b1633de80b",
    TanKuangBanner :"adunit-40805afe64c224d7",

    CurrencyVideo :"adunit-e935209504bcd1d9",
    ShopVideo:"adunit-0b82ddfb317611c5",
    OwnerChatVideo:"adunit-2b204aa17be1525b",
    GoldTipVideo:"adunit-f97b750398b5e1cb",
    OfflineGoldVideo:"adunit-871fc09199c258d4",
}

window.AppId = [
     "wxb1dcd8a1ebb1a901", //KunZiPanda
     "wx22ebb6f2a0793d46", //BieMaoWo
     "wxde272ccd814eaca1", //抓娃娃
     "wxbfc58c74a068101c", //弹球
     "wx06ad63edb666b32a", //一笔画猪
]