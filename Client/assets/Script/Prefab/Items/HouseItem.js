let CallBackHelp = require("CallBackHelp");
let JsonConfig = require("JsonConfig");
let LoadManager = require("LoadManager");
let BigNumber = require("BigNumber");
let AudioHelp = require("AudioHelp");
let PanelManager = require("PanelManager");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        icon_lv:cc.Sprite,
        label_lv:cc.Label,
        fengSpine:cc.Node,
    },

    start () {
        let self = this;
        self.isTouchstart = false;

        self.node.zIndex = 1;
        this.node.on(cc.Node.EventType.TOUCH_START,function(event){
            if (self.fengSpine.active && !this.isJie) {
                self.setFengSpine(3);
                return;
            }
            self.isTouchstart = true;
            self.node.zIndex = 2;
            CallBackHelp.callFunc(window.CallBackMsg.TouchStartHouse,this);
            Utils.setMapOnClickHouse(true,self.standBlock);
        },this); 

        this.node.on(cc.Node.EventType.TOUCH_END,function(event){
            if (self.fengSpine.active && !this.isJie) {
                return;
            }
            self.isTouchstart = false;
            CallBackHelp.callFunc(window.CallBackMsg.TouchendHouse,this);
            self.node.zIndex = 1;
            Utils.setMapOnClickHouse(false,self.standBlock,self.oldBlock);
        },this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (self.fengSpine.active && !this.isJie) {
                return;
            }
            self.isTouchstart = false;
            CallBackHelp.callFunc(window.CallBackMsg.TouchendHouse,this);
            self.node.zIndex = 1;
            Utils.setMapOnClickHouse(false,self.standBlock,self.oldBlock);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event){
            if(self.isTouchstart)
            {
                if (self.fengSpine.active && !this.isJie) {
                    return;
                }
                let delta = event.getDelta();// cc.Vec2();
                self.node.x += delta.x;
                self.node.y += delta.y ;
                CallBackHelp.callFunc(window.CallBackMsg.MoveHouse,this);
                Utils.setMapOnClickHouse(true,self.standBlock);
            }
        },self);
        var label_produce = this.node.getChildByName("Layout");
        label_produce.active = false;
    },

    
    setStandBlock(block,action){
        this.oldBlock = this.standBlock;
        this.standBlock = block;
        if(block) {
            this.node.x = block.node.x;
            this.node.y = block.node.y;
        }
    },  

    setData(data,isLvUP){
        this.houseData = data;
        this.label_lv.string = data.lv;
        this.node.getChildByName("Layout").getChildByName("label_produce").getComponent(cc.Label).string = BigNumber.getShowString(data.produce.toString());

        var spriteFrame = LoadManager.getSpriteFrameWithKey(data.image);
        if(spriteFrame){
            var img_anim = this.node.getChildByName("img_anim");
            var house = this.node.getChildByName("img_house");
            var scale = Utils.setScaleForLv(data.lv);
            house.scale = scale;
            house.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            if(isLvUP){
                AudioHelp.playSimpleAudioEngine("merge",0.7);
                var component =  PanelManager.getItem(window.PrefabType.Ef_Add,img_anim);
                component.getComponent(cc.Animation).play("Anima_ef_add");
                component.getComponent(cc.Animation).on('finished',function(){
                    this.onfinish(component);
                },this);
            }
        }
    },

    onfinish:function(node){
        node.destroy();
    },

    getProduce(show){
        if(show)
        {
            var label_produce = this.node.getChildByName("Layout");
            label_produce.active = true;
            label_produce.stopAllActions();
            var action = cc.sequence(
                cc.moveBy(0.5,0,30),
                cc.callFunc(function(){
                    label_produce.active = false;
                    label_produce.y = 40;
                }));
            label_produce.runAction(action);
        }

        let showProduce = this.houseData.produce;
        if(window.GameData.timesTick > 0){
            showProduce = BigNumber.mul(this.houseData.produce, "2");
        }
        this.node.getChildByName("Layout").getChildByName("label_produce").getComponent(cc.Label).string = BigNumber.getShowString(showProduce.toString());

        return this.houseData.produce;
    },

    getProduceAnim(){
        if(this.fengSpine.active){
            return;
        }
        var label_produce = this.node.getChildByName("Layout");
        label_produce.active = true;
        label_produce.stopAllActions();
        AudioHelp.playSimpleAudioEngine("persecondgold", 0.1);
        var action = cc.sequence(
            cc.moveBy(0.5,0,30),
            cc.callFunc(function(){
                label_produce.active = false;
                label_produce.y = 40;
            }));
        label_produce.runAction(action);
    },
    
    getSellCost(){
        return this.houseData.cost;
    },

    levelUp(){
        var nextLevel = this.houseData.lv + 1
        var o = JsonConfig.getRowWithKV("lv",nextLevel,"HouseConfig");
        if(o){
            this.setData(o,true);
            let houseLevel = this.houseData.lv;
            if(houseLevel > window.GameData.level){
                window.GameData.setLevel(houseLevel);
            }
            return true;
        }
        return false;
    },

    /**
     * type 1封 2待机 3解封
     */
    setFengSpine:function(type){
        this.fengSpine.active = true;
        if(type == 1){
            this.fengSpine.getComponent("sp.Skeleton").setAnimation(0, "feng", false);
        }else if(type == 2){
            this.fengSpine.getComponent("sp.Skeleton").setAnimation(0, "daiji", false);
        }else{
            this.isJie = true;
            this.fengSpine.getComponent("sp.Skeleton").setAnimation(0, "chai", false);
        }
        let self = this;
        this.fengSpine.getComponent("sp.Skeleton").setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";  
            if(animationName == "feng"){
                self.fengSpine.getComponent("sp.Skeleton").setAnimation(0, "daiji", false);
            }
            if(animationName == "chai"){
                this.isJie = false;
                self.fengSpine.getComponent("sp.Skeleton").animation = null;
                self.fengSpine.active = false;
            }
        });
    },

    getSaveData(){
        return {block_id:this.standBlock.blockData.id, house_lv:this.houseData.lv,isfeng : this.fengSpine.active}
    },
    
    onEnable () {
    },
    
    onDisable: function () {
        CallBackHelp.removeCallByTarget(this);
        this.node.targetOff(this);
    },
    // update (dt) {},
});
