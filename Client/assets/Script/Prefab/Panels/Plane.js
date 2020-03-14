
cc.Class({
    extends: cc.Component,

    init(arrData) {
        this.houseData = arrData;
        var action = cc.sequence(
            cc.callFunc(function () {
                this.node.getComponent("sp.Skeleton").setAnimation(0, "go", true);
            }, this),
            cc.moveBy(3, 500, 0),
            cc.callFunc(function () {
                if(this.houseData  && !this.houseData.isTouchstart && this.houseData.node.x == this.houseData.standBlock.node.x && this.houseData.node.y == this.houseData.standBlock.node.y){
                    this.houseData.setFengSpine(1);
                }
            }, this),
            cc.moveBy(3, 500, 0),
            cc.callFunc(function () {
                this.node.getComponent("sp.Skeleton").animation = null;
                this.node.active = false;
            }, this),
        )
        this.node.runAction(action);
    },

});
