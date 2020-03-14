
let BigNumber = require("BigNumber");
let Utils = require("Utils");
let JsonConfig = require("JsonConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        userHead:cc.Sprite,
        userName:cc.Label,
        userSex:cc.Sprite,
        rankLabel:cc.Label,
        userScore:cc.Label,
        baseImg:cc.SpriteAtlas,
        labelPos:cc.Label,

        itemID: 0
    },

    init:function(data,index){
        this.itemID = index;
        if(data){
            var url = data.img;
            Utils.createImage(url, this.userHead);
            this.userName.string = Utils.atobUserInfo(data.nickname);
    
            let spname = data.sex == 2 ? "icon_woman" : "icon_man";
            this.userSex.spriteFrame = this.baseImg.getSpriteFrame(spname);
            
    
            let money = BigNumber.getShowString(data.produce);
            this.userScore.getComponent(cc.Label).string = money + "/秒";
    
            let dataHouse = JsonConfig.getRowWithKV("lv", data.level, "HouseConfig");
            if(dataHouse){
                this.labelPos.string = "Lv." + data.level + dataHouse.name;
            }else{
                this.labelPos.string = "未获取";
            }
    
            this.rankLabel.string = index + 4;
        }
    },
});
