let CallBackHelp = require("CallBackHelp");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.targetY = 120;
        let self = this;
        CallBackHelp.addCall(window.CallBackMsg.AddTipsShow,function(param){
            self.targetY += 48;
            //self.node.y += 50;
        },this);
    },

    start () {
        
        // let moveAction = cc.moveTo(0.8,0,this.targetY);
        // this.node.runAction(moveAction);

        let fadeOutAction = cc.sequence(
            cc.delayTime(1.5),
            cc.fadeOut(0.5),
            cc.removeSelf());
        this.node.runAction(fadeOutAction);
    },

    setDesc(desc) {
        this.node.getChildByName("label_desc").getComponent(cc.Label).string = desc;
    },

    update (dt) {
        if(this.node.y < this.targetY){
            this.node.y += 6;
        }
    },
});
