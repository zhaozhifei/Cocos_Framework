let PanelManager = require("PanelManager");
let JsonConfig = require("JsonConfig");
let BigNumber = require("BigNumber");
let CallBackHelp = require("CallBackHelp");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollView:cc.ScrollView,
        labelDiamond:cc.Label,
        labelGold:cc.Label,

        rankItem: 130,
        spawnCount: 0,
        totalCount: 0,
        spacing: 15,
    },

    start () {
        if(window.IsPhoneType == "pad"){
            this.node.scale = 0.7;
            this.node.getChildByName("layout").scale = 1.5;
        }
        this.showShopContent();
        this.labelDiamond.string = window.GameData.diamond;
        this.labelGold.string = BigNumber.getShowString(window.GameData.gold);
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.ChangeGold,function(param){
            self.labelGold.string = BigNumber.getShowString(window.GameData.gold);
        },self);
        CallBackHelp.addCall(window.CallBackMsg.ChangeDiamond,function(param){
            self.labelDiamond.string = window.GameData.diamond;
        },self);
    },

    showShopContent:function(){
        this.scrollView.content.removeAllChildren();
        this.data = JsonConfig.loadItems.HouseConfig;
        // if(window.GameData.level < 35){
        //     this.data = this.dataArr.slice(0,this.dataArr.length - 3);
        // } else{
            // this.data = this.dataArr;
        // }
        this.initScrollView();
    },


    initScrollView: function () {
        this.totalCount = this.data.length;
        if(this.totalCount >= 10){
            this.spawnCount = 10;
        }else{
            this.spawnCount = this.totalCount;
        }
        this.content = this.scrollView.content;
        this.content.removeAllChildren();
        this.items = []; // 存储实际创建的项数组
        this.initialize();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        // 使用这个变量来判断滚动操作是向上还是向下
        this.lastContentPosY = 0;
        // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
        this.bufferZone = this.spawnCount * (this.rankItem + this.spacing) / 2;
    },


    // 列表初始化
    initialize: function () {
        // 获取整个列表的高度
        this.content.height = this.totalCount * this.rankItem;
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            let data = this.data[i];
            let item = PanelManager.getItem(window.PrefabType.ShopItem,this.scrollView.content);
            item.setData(data,i);
            item.node.position = cc.v2(0, -item.node.height * (0.5 + i)); // - this.spacing * (i + 1)
            this.items.push(item.node);
        }
    },

    // 返回item在ScrollView空间的坐标值
    getPositionInView: function (item) {
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function (dt) {
        if (this.scrollView.content.childrenCount > 0) {
            this.updateTimer += dt;
            if (this.updateTimer < this.updateInterval) {
                return; // we don't need to do the math every frame
            }
            this.updateTimer = 0;
            let items = this.items;
            // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
            let isDown = this.scrollView.content.y < this.lastContentPosY;
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
                        let item = items[i].getComponent('ShopItem');
                        let itemId = item.itemID - items.length; // update item id
                        item.setData(this.data[itemId], itemId);
                    }
                } else {
                    // 提前计算出该item的新的y坐标
                    newY = items[i].y - offset;
                    // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
                    // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
                    if (viewPos.y > this.bufferZone && newY > -this.content.height) {
                        items[i].y = (newY);
                        let item = items[i].getComponent('ShopItem');
                        let itemId = item.itemID + items.length;
                        item.setData(this.data[itemId], itemId);
                    }
                }
            }
            // 更新lastContentPosY和总项数显示
            this.lastContentPosY = this.scrollView.content.y;
        }
    },


    btnClickClose(){
        this.node.destroy();
    },

    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
        // window.GameData.banner.show();
        window.GameData.isSeeVideo = false;
    },

});
