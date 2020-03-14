
let JsonConfig = require("JsonConfig");
let PanelManager = require("PanelManager");
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView:cc.ScrollView,
        scrollViewContent:cc.Node,
    },

    start(){
        if(window.IsPhoneType == "pad"){
            this.node.scale = 0.7;
            this.node.getChildByName("Layout").scale = 1.5;
        }
    },

    init:function(inviteData){
        let invitedArr = new Array();
        let inviteYes = new Array();
        for(let i =0;i<inviteData.length;i++){
            if(inviteData[i].count > 0){
                invitedArr.push(inviteData[i]);
                inviteData[i] = null;
            }else{
                if(window.GameData.share >= inviteData[i].inviteNum){
                    inviteYes.push(inviteData[i]);
                    inviteData[i] = null;
                }   
            }
        }
        let invite = new Array();
        invite = inviteYes.concat(inviteData);
        invite = invite.concat(invitedArr);
        
        for (let i = 0; i < invite.length; i++){
            if(invite[i] == null) continue;
            var info = invite[i];
            var component =  PanelManager.getItem(window.PrefabType.BaseItem,this.scrollViewContent);
            component.init(info,"invite");
        }
        let addedTimesTick = 0;

        let inviteDataConfig = JsonConfig.loadItems.DataConfig.InviteData;
        for (let i = 0; i <invitedArr.length; i++ ){
            var info = invitedArr[i];
            if(info.count > 0){
                let rewardConfig = inviteDataConfig[info.id - 1];
                if(rewardConfig.diamond){
                }

                else if(rewardConfig.time){
                    addedTimesTick += rewardConfig.time;
                }
                else{
                    window.GameData.setIsHaveLongClick(1);
                }
            }
        }
        window.GameData.setAddedTimesTick(addedTimesTick);
    },

    btnClickClose:function(){
        this.node.destroy();
    },
});
