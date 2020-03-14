 let JsonConfig  = require("JsonConfig");
 let PanelManager  = require("PanelManager");
cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
    },

    start () {
        let data = JsonConfig.loadItems.DataConfig.AppIconData;
        for(var i=0;i<data.length;i++){
            var info = data[i];
            var component =  PanelManager.getItem(window.PrefabType.OtherGameItem,this.content);
            component.init(info);
        }
    },

    btnClickClose:function(){
        this.node.destroy();
    },

    btnClickLayout:function(){
        this.node.destroy();
    }

});
