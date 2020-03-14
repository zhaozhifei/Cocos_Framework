
let LoadManager = require("LoadManager");
module.exports = {

    //打开面板（返回子节点的脚本）
    openPanel(id){
        let prefabData = LoadManager.getPrefabWithKey(id);
        if(prefabData && prefabData.res){
            let prefab = cc.instantiate(prefabData.res);
            cc.director.getScene().getChildByName("Canvas").addChild(prefab);
            if(prefabData.config.component){
                let component = prefab.getComponent(prefabData.config.component);
                if(component){
                    return component;
                }
            }
        }
        return null;
    },

    //获取一个子节点（返回子节点的脚本）
    getItem(id,parent){
        let prefabData = LoadManager.getPrefabWithKey(id);
        if(prefabData && prefabData.res){
            let prefab = cc.instantiate(prefabData.res);
            parent.addChild(prefab);
            if(prefabData.config.component){
                let component = prefab.getComponent(prefabData.config.component);
                if(component){
                    return component;
                }
            }else{
                return prefab;
            }
        }
        return null;
    },
};