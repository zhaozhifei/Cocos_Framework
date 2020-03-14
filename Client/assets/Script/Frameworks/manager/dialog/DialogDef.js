/*
 * @Description: 对话框定义
 * @Author: mengjl
 * @LastEditors  : mengjl
 * @Date: 2019-04-18 16:27:03
 * @LastEditTime : 2020-01-17 17:15:15
 */

var DialogDef = module.exports;

// Dialog Model
DialogDef.DialogModel = cc.Enum({
    destory : 0,              // 毁灭模式
    hide : 1,                 // 神隐模式
});

// Dialog State
DialogDef.DialogState = cc.Enum({
    closed : 0,             // 关闭
    opened : 1,             // 开启
    opening : 2,            // 打开中
    closing : 3,            // 关闭中
});

// Dialog Animation
DialogDef.DialogAnimation = cc.Enum({
    no_animation : 0,             // 没有动画
    ease_back_out : 1,            // 由小变大
    left_to_right : 2,            // 左到右
    right_to_left : 3,            // 右到左
    top_to_down : 4,              // 上到下
    down_to_top : 5,              // 下到上
    rotate_to_centre : 6,         // 旋转到中心
    fade_to_centre : 7,           // 淡入
    fall_to_centre : 8,           // 坠入
    jump_to_centre : 9,           // 跳入
    skew_to_centre : 10,          // 倾斜
    flip_to_centre : 11,          // 翻转
});

DialogDef.DialogMask = 'Prefab/Dialogs/DialogMask';

// Dialog ID
DialogDef.DialogID = cc.Enum({
    //------------------ 注册界面 ------------------//
    dialog_loading : 'Prefab/Dialogs/DialogLoading',
    dialog_guide : 'Prefab/Dialogs/DialogGuide',

    dialog_ad_debug : 'Prefab/Dialogs/DialogADDebug',
    dialog_ad_gold : 'Prefab/Dialogs/DialogADGold',
    dialog_ad_info : 'Prefab/Dialogs/DialogADInfo',
    dialog_ad_red : 'Prefab/Dialogs/DialogADRed',
    dialog_ad_red_yoyo : 'Prefab/Dialogs/DialogADRedYoYo',
    dialog_banner : 'Prefab/Dialogs/DialogBanner',
    dialog_cooldown : 'Prefab/Dialogs/DialogCooldown',
    dialog_explain : 'Prefab/Dialogs/DialogExplain',
    dialog_easter_egg : 'Prefab/Dialogs/DialogEasterEgg',
    dialog_gametip : 'Prefab/Dialogs/DialogGameTip',
    dialog_handbook : 'Prefab/Dialogs/DialogHandbook',
    dialog_levelup : 'Prefab/Dialogs/DialogLevelup',
    dialog_levelup_fail : 'Prefab/Dialogs/DialogLevelupFail',
    dialog_luck : 'Prefab/Dialogs/DialogLuck',
    dialog_map_info : 'Prefab/Dialogs/DialogMapInfo',
    dialog_password_lock : 'Prefab/Dialogs/DialogPasswordLock',
    dialog_profit : 'Prefab/Dialogs/DialogProfit',
    dialog_rank : 'Prefab/Dialogs/DialogRank',
    dialog_red_game : 'Prefab/Dialogs/DialogRedGame',
    dialog_realname : 'Prefab/Dialogs/DialogRealName',
    dialog_red_coming : 'Prefab/Dialogs/DialogRedComing',
    dialog_record : 'Prefab/Dialogs/DialogRecord',
    dialog_reward : 'Prefab/Dialogs/DialogReward',
    dialog_reward_red : 'Prefab/Dialogs/DialogRewardRed',
    dialog_reward_double : 'Prefab/Dialogs/DialogRewardDouble',
    dialog_setting : 'Prefab/Dialogs/DialogSetting',
    dialog_select_server : 'Prefab/Dialogs/DialogSelectServer',
    dialog_share : 'Prefab/Dialogs/DialogShare',
    dialog_tip : 'Prefab/Dialogs/DialogTip',
    dialog_user : 'Prefab/Dialogs/DialogUser',
    dialog_video : 'Prefab/Dialogs/DialogVideo',
    dialog_wallet : 'Prefab/Dialogs/DialogWallet',
});