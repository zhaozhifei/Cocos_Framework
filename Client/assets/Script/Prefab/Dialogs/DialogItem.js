/*
 * @Author: mengjl
 * @Date: 2020-02-26 17:15:30
 * @LastEditTime: 2020-02-28 15:30:24
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogItem.js
 */

let DialogBase = require("DialogBase")
let ItemMgr = require("ItemMgr")

cc.Class({
    extends: DialogBase,

    properties: {
        scroll_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
        item_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
    },

    onLoad () {
        unit.DialogMgr.listen(unit.DialogID.dialog_buy_item, this.onItemChange.bind(this));
        unit.DialogMgr.listen(unit.DialogID.dialog_use_item, this.onItemChange.bind(this));
    },

    start () {
        ItemMgr.readItem();
        var list = ItemMgr.getItemConfigList();

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            var item = cc.instantiate(this.item_node);
            item.active = true;
            this.scroll_node.addChild(item);

            // item._id_ = element.id;
            var item_count = ItemMgr.getItemCount(element.id);
            cc.find('img_bg_1', item)._id_ = element.id;
            cc.find('img_bg_1/lbl_name', item).getComponent(cc.Label).string = element.name + 'x' + item_count;

            unit.ResMgr.replaceFrame(cc.find('img_bg_1/img', item), 'Images/UI/gameui', element.img);
        }
    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        ItemMgr.readItem();
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    onItemChange()
    {
        var list = this.scroll_node.children;
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            var id = cc.find('img_bg_1', item)._id_;
            var item_count = ItemMgr.getItemCount(id);
            var item_data = ItemMgr.getItemConfig(id);
            cc.find('img_bg_1/lbl_name', item).getComponent(cc.Label).string = item_data.name + 'x' + item_count;
        }
    },

    onClickUse(params)
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_use_item, {id : params.target._id_});
    },
    
});
