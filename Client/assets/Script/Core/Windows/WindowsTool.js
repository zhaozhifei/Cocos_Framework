/*
 * @Author: your name
 * @Date: 2020-02-27 10:13:08
 * @LastEditTime: 2020-02-28 14:41:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \client\assets\Script\Core\Windows\WindowsTool.js
 */

window.IsPhoneType = "phone";

window.WinSizeRefresh = function(node){
    cc.winSize.height / 2;
    var ui_top = node.getChildByName("ui_top");
    var ui_top1 = node.getChildByName("ui_top1");
    var ui_down = node.getChildByName("ui_down");
    var ui_down2 = node.getChildByName("ui_down2");
    if(ui_top){
        let moveY = (cc.winSize.height - 1136)/2;
        // if(moveY < 0){
            ui_top.y = moveY;
        // }
    }
    if(ui_top1){
        let moveY = (cc.winSize.height - 1136)/2;
        // if(moveY < 0){
            ui_top1.y = moveY;
        // }
    }
    // if(ui_down){
    //     let moveY = (1136 - cc.winSize.height)/2;
    //     if(moveY > 0){
    //         ui_down.y = moveY;
    //     }
    //     ui_down.y -= 180;
    // }
    // if(ui_down2){
    //     let moveY = (1136 - cc.winSize.height)/2;
    //     if(moveY > 0){
    //         ui_down2.y = moveY;
    //     }
    //     ui_down2.y -= 180;
    // }
};