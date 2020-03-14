/*
 * @Author: your name
 * @Date: 2020-02-27 11:01:23
 * @LastEditTime: 2020-02-28 15:29:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogUseItem.js
 */

let DialogBase = require("DialogBase")
let ItemMgr = require("ItemMgr")

cc.Class({
    extends: DialogBase,

    properties: {
        item_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
    },

    // onLoad () {},

    start () {
        unit.DialogMgr.listen(unit.DialogID.dialog_buy_item, this.onItemChange.bind(this));
    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');

        var id = params.id;
        this.item_id = id;
        var item_data = ItemMgr.getItemConfig(id);
        var item_count = ItemMgr.getItemCount(id);
        cc.find('img_bg_1/lbl_name', this.item_node).getComponent(cc.Label).string = item_data.name + 'x' + item_count;
        unit.ResMgr.replaceFrame(cc.find('img_bg_1/img', this.item_node), 'Images/UI/gameui', item_data.img);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    onItemChange()
    {
        var item_data = ItemMgr.getItemConfig(this.item_id);
        var item_count = ItemMgr.getItemCount(this.item_id);
        cc.find('img_bg_1/lbl_name', this.item_node).getComponent(cc.Label).string = item_data.name + 'x' + item_count;
    },

    onClickUse()
    {
        var item_data = ItemMgr.getItemConfig(this.item_id);
        
        if (this.item_id == '1') {
            if (window.GameData.timesTick > 0) {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '已经在加倍中了……'});
                return;
            }

            var result = ItemMgr.useItem(this.item_id);
            console.error('onClickUse', result)
            if (result == 0) {
                window.GameData.setTimesTick(window.diamondTime + parseInt(window.GameData.addedTimesTick));
                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '使用' + item_data.name + '成功！'});
                this.closeDialog();
            }
            else if (result == 1) {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_buy_item, {id : this.item_id});
            }
        }
        else if (this.item_id == '3') {
            var result = ItemMgr.useItem(this.item_id);
            console.error('onClickUse', result)
            if (result == 0) {
                let JsonConfig = require("JsonConfig")
                for (let index = 0; index < JsonConfig.loadItems.BlockConfig.length; index++) {
                    const blockData = JsonConfig.loadItems.BlockConfig[index];
                    if (blockData.flag == 1 && window.GameData.share < blockData.lockShare && window.GameData.level <= blockData.lockLV) {
                        console.error(blockData)
                        window.GameData.setShare(blockData.lockShare);
                        window.ServerStorage.saveServerStorage();
                        break;
                    }
                }

                unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '使用' + item_data.name + '成功！'});
                this.closeDialog();
            }
            else if (result == 1) {
                unit.DialogMgr.showDialog(unit.DialogID.dialog_buy_item, {id : this.item_id});
            }
        }

    },
    
});
