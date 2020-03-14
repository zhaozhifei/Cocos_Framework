/*
 * @Author: mengjl
 * @Date: 2020-02-26 13:00:35
 * @LastEditTime: 2020-02-27 11:16:14
 * @LastEditors: Please set LastEditors
 * @Description: 
 * @FilePath: \client\assets\Script\Prefab\Dialogs\DialogShop.js
 */

let DialogBase = require("DialogBase")
let ItemMgr = require("ItemMgr")

cc.Class({
    extends: DialogBase,

    properties: {
        left_nodes : {
            default: [],
            type: [cc.Node],
            tooltip : "遮罩透明度",
        },
        scroll_nodes : {
            default: [],
            type: [cc.Node],
            tooltip : "遮罩透明度",
        },
        scroll_views : {
            default: [],
            type: [cc.ScrollView],
            tooltip : "遮罩透明度",
        },
        item_z_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
        item_d_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
        item_f_node : {
            default: null,
            type: cc.Node,
            tooltip : "遮罩透明度",
        },
    },

    // onLoad () {},

    start () {
        this.item_z_node.active = false;
        this.item_d_node.active = false;
        this.initLeft();
        this._select_index = -1;
        this.setLeft(0);
        this.showZ();
        this.showD();
        this.showF();
        this.showPanel(0);
    },

    onEnter(params)
    {// 对话框被激活时
        // console.log('DialogBase onEnable');
        // this._select_index = 0;
        // this.showZ();
        // this.setLeft(0);
    },

    onLeave()
    {// 对话框被关闭时
        // console.log('DialogBase onDisable');
    },

    // update (dt) {},

    initLeft()
    {
        for (let index = 0; index < this.left_nodes.length; index++) {
            const node = this.left_nodes[index];
            node._index_ = index;
        }
    },

    onClickLeft(params)
    {
        var idx = params.target._index_;
        this.showPanel(idx);
    },

    showPanel(idx)
    {
        if (this._select_index == idx) {
            return;
        }
        this._select_index = idx;
        
        this.setLeft(idx);
        for (let index = 0; index < this.scroll_views.length; index++) {
            const element = this.scroll_views[index];
            element.node.active = index == idx;
        }
    },

    setLeft(idx)
    {
        for (let index = 0; index < this.left_nodes.length; index++) {
            const node = this.left_nodes[index];
            cc.find('img_bg', node).active = (idx == index);
            cc.find('lbl', node).color = (idx == index) ? cc.color(0, 0, 0, 255) : cc.color(255, 255, 255, 255);
        }
    },

    onClickZ(params)
    {
        cc.log('onClickZ', params.target._value_);
        unit.DialogMgr.showDialog(unit.DialogID.dialog_tip, {text : '暂未开放'});
    },

    onClickD(params)
    {
        // cc.log('onClickD', params.target._data_);
        unit.DialogMgr.showDialog(unit.DialogID.dialog_buy_item, {id : params.target._id_});
    },

    showZ()
    {
        // this.scroll_node.removeAllChildren();
        // this.scroll_node.setContentSize(460, 650);
        // this.scroll_node.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
        // this.scroll_view.stopAutoScroll();
        
        var list = [
            {name : '3元礼包', value : 3, desc : '内含30钻石', img : 'daoju_zuanshi01', },
            {name : '10元礼包', value : 10, desc : '内含100钻石', img : 'daoju_zuanshi02', },
            {name : '50元礼包', value : 50, desc : '内含500钻石', img : 'daoju_zuanshi03', },
            {name : '100元礼包', value : 100, desc : '内含1000钻石', img : 'daoju_zuanshi04', },
        ];

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            var item = cc.instantiate(this.item_z_node);
            item.active = true;
            this.scroll_nodes[0].addChild(item);

            cc.find('btn_yuanblue', item)._value_ = element.value;
            cc.find('img_bg_1/lbl_name', item).getComponent(cc.Label).string = element.name;
            cc.find('img_bg_1/lbl_desc', item).getComponent(cc.Label).string = element.desc;

            unit.ResMgr.replaceFrame(cc.find('img_bg_1/img', item), 'Images/UI/gameui', element.img);
        }

    },

    showD()
    {
        // this.scroll_node.removeAllChildren();
        // this.scroll_node.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
        // this.scroll_view.stopAutoScroll();

        var list = ItemMgr.getItemConfigList();

        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            var item = cc.instantiate(this.item_d_node);
            item.active = true;
            this.scroll_nodes[1].addChild(item);

            cc.find('img_bg_2/btn_yuanblue', item)._id_ = element.id;
            cc.find('img_bg_1/lbl_name', item).getComponent(cc.Label).string = element.name;
            cc.find('img_bg_2/lbl_desc', item).getComponent(cc.Label).string = element.desc;

            unit.ResMgr.replaceFrame(cc.find('img_bg_1/img', item), 'Images/UI/gameui', element.img);
        }

    },

    showF()
    {
        // this.scroll_node.removeAllChildren();
        // this.scroll_node.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;
        // this.scroll_view.stopAutoScroll();

        let JsonConfig = require("JsonConfig");
        var data = JsonConfig.loadItems.HouseConfig;
        for (let index = 0; index < data.length; index++) {
            unit.PoolManager.getPerfab(unit.PoolDef[unit.PoolDef.pool_shop_item], (item)=>{
                item.getComponent('ShopItem').setData(data[index], index);
                this.scroll_nodes[2].addChild(item);
            });
        }

        this.scroll_views[2].scrollToTop(0.5);
    },
    
});
