/*
 * @Author: your name
 * @Date: 2020-02-27 10:48:14
 * @LastEditTime: 2020-02-28 17:05:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogBuyItem.js
 */

let DialogBase = require("DialogBase")
let ItemMgr = require("ItemMgr")

cc.Class({
    extends: DialogBase,

    properties: {
        name_lbl : {
            default: null,
            type: cc.Label,
            tooltip : "遮罩透明度",
        },
        value_lbl : {
            default: null,
            type: cc.Label,
            tooltip : "遮罩透明度",
        },
        num_lbl : {
            default: null,
            type: cc.Label,
            tooltip : "遮罩透明度",
        },
        item_img : {
            default: null,
            type: cc.Sprite,
            tooltip : "遮罩透明度",
        },
    },

    // onLoad () {},

    start () {

    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        var id = params.id;
        var item_data = ItemMgr.getItemConfig(id);
        var item_count = ItemMgr.getItemCount(id);

        this.name_lbl.string = item_data.name;
        this.value_lbl.string = item_data.value;
        this.num_lbl.string = '0';

        this.buy_id = id;
        this.buy_num = 0;
        unit.ResMgr.replaceFrame(this.item_img, 'Images/UI/gameui', item_data.img);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    onClickBuy()
    {
        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '暂未开放购买'});
        return;

        var result = ItemMgr.buyItem(this.buy_id, this.buy_num);
        if (result == 0) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '购买' + this.name_lbl.string + '成功'});
        } 
        else if (result == 1) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '配置文件错误'});
        }
        else if (result == 2) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '钻石不足'});
        }
        else if (result == 3) {
            unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '购买数量错误'});
        }
    },

    onClickAdd()
    {
        this.buy_num += 1;
        this.num_lbl.string = this.buy_num;
    },

    onClickSub()
    {
        this.buy_num -= 1;
        if (this.buy_num < 0) {
            this.buy_num = 0;
        }
        this.num_lbl.string = this.buy_num;
    },
});
