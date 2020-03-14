let HttpHelp = require("HttpHelp");
let PanelManager = require("PanelManager");
let Utils = require("Utils");
let BigNumber = require("BigNumber");
let JsonConfig = require("JsonConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        rankingView: cc.Sprite,//显示排行榜
        btnFriend: cc.Button,
        btnWorld: cc.Button,
        worldRankingView: cc.Node,
        rankScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        gameOverRankForMe: cc.Node,
        topNode: cc.Node,
        loadingLabel: cc.Label,

        baseImg: cc.SpriteAtlas,

        rankItem: 110,
        spawnCount: 0,
        totalCount: 0,
        spacing: 15,
    },

    start() {
        if(window.IsPhoneType == "pad"){
            this.node.scale = 0.7;
            this.node.getChildByName("layout").scale = 1.5;
        }
        this.initBtn();
        this.curBtn = this.btnFriend.node;
        this.showListContent();
    },

    initBtn: function () {
        this.btnFriend.interactable = false;
        this.btnWorld.interactable = true;
        this.setBtnStatu(false, this.btnWorld.node);
        this.setBtnStatu(true, this.btnFriend.node);
    },

    setBtnStatu: function (isClick, node) {
        if (!isClick) {
            node.color = cc.color(153, 122, 122);
            node.getChildByName("icon").color = cc.color(194, 188, 188);
        } else {
            node.color = cc.color(255, 255, 255);
            node.getChildByName("icon").color = cc.color(255, 255, 255);
        }
    },

    getWorldData: function () {
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.WorldTop;
        var parmes = {
            userid: window.SystemInfo.serverStringId,
        };
        let self = this;
        HttpHelp.httpPost(url, parmes, function (res) {
            if (res && res.errcode == 0) {
                self.loadingLabel.node.active = false;
                self.data = res.data;
                self.getTopThreeData();
                self.setTopNode();
                self.initScrollView();
            } else {
                self.loadingLabel.string = "加载失败...";
                require("WXHelp").showWXTips("提示", "网络异常，请稍后重试！");
            }
        });
    },

    showListContent() {
        this.rankingView.node.active = false;
        this.worldRankingView.active = false;
        this.scrollViewContent.removeAllChildren();
        if (this.curBtn == this.btnFriend.node) {
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                this.rankingView.node.active = true;
                this.tex = new cc.Texture2D();
                var openDataContext = wx.getOpenDataContext();
                this.sharedCanvas = openDataContext.canvas;
                this.sharedCanvas.width = 555;
                this.sharedCanvas.height = 770;
                wx.postMessage({
                    messageType: 2,
                    MAIN_MENU_NUM: "userGameRank",
                });
            }
        } else {
            this.worldRankingView.active = true;
            this.gameOverRankForMe.active = false;
            this.loadingLabel.node.active = true;
            this.loadingLabel.string = "加载中...";
            if (this.data) {
                this.loadingLabel.node.active = false;
                this.getTopThreeData();
                this.setTopNode();
                this.initScrollView();
            } else {
                this.getWorldData();
            }
        }
    },

    setTopNode: function () {
        for (var i = 0; i < this.topThree.length; i++) {
            let node = this.topNode.getChildByName("item_bg" + i);
            node.active = true;
            this.setNodeFotData(node, this.topThree[i]);
        }
    },

    setNodeFotData: function (node, data, index) {
        var url = data.img;
        Utils.createImage(url, node.getChildByName("img_head").getComponent(cc.Sprite));
        let spname = data.sex == 2 ? "icon_woman" : "icon_man";
        node.getChildByName("usersex").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(spname);
        node.getChildByName("userName").getComponent(cc.Label).string = Utils.atobUserInfo(data.nickname);
        let money = BigNumber.getShowString(data.produce);
        node.getChildByName("goldlayout").getChildByName("labelgold").getComponent(cc.Label).string = money + "/秒";
        let dataHouse = JsonConfig.getRowWithKV("lv", data.level, "HouseConfig");
        if(dataHouse){
            node.getChildByName("layout").getChildByName("labelplace").getComponent(cc.Label).string = "Lv." + data.level + dataHouse.name;
        }else{
            node.getChildByName("layout").getChildByName("labelplace").getComponent(cc.Label).string = "未获取";
        }
        if (index) {
            node.getChildByName("ranklabel").getComponent(cc.Label).string = index;
        }
    },

    getTopThreeData: function () {
        var backUp = this.data;
        if (backUp.length <= 3) {
            this.topThree = backUp;
            this.otherData = [];
        } else {
            this.topThree = backUp.slice(0, 3);
            this.otherData = backUp.slice(3, backUp.length);
        }
    },

    btnClosePanelClick: function () {
        this.scrollViewContent.removeAllChildren();
        this.node.destroy();
    },

    btnTopTypeClick: function (event) {
        if (event.currentTarget == this.curBtn) return;
        this.updateCurBtn(event.currentTarget);
        this.showListContent();
    },

    updateCurBtn: function (btn) {
        this.curBtn.getComponent(cc.Button).interactable = true;
        btn.getComponent(cc.Button).interactable = false;
        this.setBtnStatu(true, btn)
        this.setBtnStatu(false, this.curBtn)
        this.curBtn = btn;
    },


    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (this.sharedCanvas != undefined) {
            this.tex.initWithElement(this.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },

    initScrollView: function () {
        this.totalCount = this.otherData.length;
        if (this.totalCount >= 7) {
            this.spawnCount = 7;
        } else {
            this.spawnCount = this.totalCount;
        }
        this.content = this.scrollViewContent;
        this.content.removeAllChildren();
        this.items = []; // 存储实际创建的项数组
        this.initialize();
        this.showMeRank();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0;
        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZone = this.spawnCount * (this.rankItem + this.spacing) / 2;
    },

    showMeRank: function () {
        this.gameOverRankForMe.active = true;
        let node = this.gameOverRankForMe.getChildByName("RankItem");
        let isMe = false;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].userid == window.SystemInfo.serverStringId) {
                isMe = true;
                this.setNodeFotData(node, this.data[i], i + 1);
            }
        }
        if (!isMe) {
            let data = WXData.userInfo;
            var url = data.avatarUrl;
            Utils.createImage(url, node.getChildByName("img_head").getComponent(cc.Sprite));
            let spname = data.gender == 2 ? "icon_woman" : "icon_man";
            node.getChildByName("usersex").getComponent(cc.Sprite).spriteFrame = this.baseImg.getSpriteFrame(spname);
            node.getChildByName("userName").getComponent(cc.Label).string = Utils.atobUserInfo(data.nickName);
            let money = BigNumber.getShowString(window.GameData.produce);
            node.getChildByName("goldlayout").getChildByName("labelgold").getComponent(cc.Label).string = money + "/秒";
            let dataHouse = JsonConfig.getRowWithKV("lv", data.level, "HouseConfig");
            if(dataHouse){
                node.getChildByName("layout").getChildByName("labelplace").getComponent(cc.Label).string =  "Lv." + data.level + dataHouse.name;
            }else{
                node.getChildByName("layout").getChildByName("labelplace").getComponent(cc.Label).string = "未获取";
            }

            node.getChildByName("ranklabel").getComponent(cc.Label).string = "未上榜";
        }


    },

    // 列表初始化
    initialize: function () {
        // 获取整个列表的高度
        this.showMeRank();
        this.scrollViewContent.height = this.otherData.length * this.rankItem;
        var worlddata = this.otherData;
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            var playerInfo = worlddata[i];
            var component = PanelManager.getItem(window.PrefabType.RankItem, this.scrollViewContent);
            component.node.position = cc.v2(0, -component.node.height * (0.5 + i)); // - this.spacing * (i + 1)
            component.init(playerInfo, i);
            this.items.push(component.node);
        }
    },

    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.rankScrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update(dt) {
        if(this.curBtn == this.btnFriend.node){
            this._updateSubDomainCanvas();
        }
        if (this.scrollViewContent.childrenCount > 0) {
            this.updateTimer += dt;
            if (this.updateTimer < this.updateInterval) {
                return; // we don't need to do the math every frame
            }
            this.updateTimer = 0;
            let items = this.items;
            // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
            let isDown = this.rankScrollView.content.y < this.lastContentPosY;
            // 实际创建项占了多高（即它们的高度累加）
            let offset = this.rankItem * items.length;
            let newY = 0;

            // 遍历数组，更新item的位置和显示
            for (let i = 0; i < items.length; ++i) {
                let viewPos = this.getPositionInView(items[i]);
                if (isDown) {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y + offset;
                    // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
                    // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y < -this.bufferZone && newY < 0) {
                        items[i].y = (newY);
                        let item = items[i].getComponent('RankItem');
                        let itemId = item.itemID - items.length; // update item id
                        item.init(this.otherData[itemId], itemId);
                    }
                } else {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y - offset;
                    // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                    // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y > this.bufferZone && newY > -this.scrollViewContent.height) {
                        items[i].y = (newY);
                        let item = items[i].getComponent('RankItem');
                        let itemId = item.itemID + items.length;
                        item.init(this.otherData[itemId], itemId);
                    }
                }
            }
            // 更新lastContentPosY和总项数显示
            this.lastContentPosY = this.scrollViewContent.y;
        }
    },

    onDisable(){
        // window.GameData.banner.show();
        window.GameData.isSeeVideo = false;
    }
});
