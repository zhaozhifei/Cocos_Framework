/*
 * @Author: your name
 * @Date: 2020-02-27 11:06:50
 * @LastEditTime: 2020-02-28 13:39:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Scene\ItemMgr.js
 */
module.exports = {
    m_items_config : [],
    m_items : {},
    unique_id : '',
    
    __init__()
    {
        this.m_items_config = [
            {id : '1', name : '加速', value : 20, desc : '获得 60s 的产出金币加速', img : 'daojuka-jiasu', },
            // {id : '2', name : '时钟', value : 10, desc : '使用后可以返回上一步操作', img : 'daojuka-shizhong', },
            {id : '3', name : '房产券', value : 50, desc : '使用后可以解锁一个格子', img : 'daojuka-fangchanquan', },
            // {id : '4', name : '房屋购买券', value : 100, desc : '可在商城购买任意解锁的一个房屋', img : 'daojuka-fangwugoumai', },
        ];

        // this._readItem_();
    },

    getItemConfig(id)
    {
        for (let index = 0; index < this.m_items_config.length; index++) {
            const data = this.m_items_config[index];
            if (data.id == id) {
                return data;
            }
        }
        return null;
    },

    getItemConfigList()
    {
        return this.m_items_config;
    },

    getItemCount(id)
    {
        if (this.m_items[id]) {
            return  this.m_items[id];
        }
        // for (let index = 0; index < this.m_items.length; index++) {
        //     const element = array[index];
            
        // }
        return 0;
    },

    buyItem(id, num = 1)
    {
        var cfg = this.getItemConfig(id);
        if (!cfg) {
            return 1;
        }

        var diamond = parseInt(window.GameData.diamond);
        var _diamond = diamond - cfg.value * num;
        if (_diamond < 0) {
            return 2;
        }

        if (num <= 0) {
            return 3;
        }

        window.GameData.setDiamond(_diamond);
        this.alertItemCount(id, num);
        return 0;
    },

    useItem(id)
    {
        var count = this.getItemCount(id);
        if (count <= 0) {
            return 1;
        }
        this.alertItemCount(id, -1);
        return 0;
    },

    alertItemCount(id, num)
    {
        var count = this.getItemCount(id);
        this.m_items[id] = count + num;
        this.saveItems();
    },

    saveItems()
    {
        window.GameData.item_list = this.m_items;
        window.ServerStorage.saveServerStorage();
        // cc.sys.localStorage.setItem('item_list' + this.unique_id, JSON.stringify(this.m_items));
    },

    readItem()
    {
        var item_list = window.GameData.item_list;
        console.log(item_list);
        if (item_list) {
            this.m_items = item_list;
        }
    },
    
};
module.exports.__init__();