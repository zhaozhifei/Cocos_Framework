/*
 * @Description: In User Settings Edit
 * @Author: mengjl
 * @Date: 2019-10-14 10:43:12
 * @LastEditors  : mengjl
 * @LastEditTime : 2020-01-13 16:14:20
 */

// cc.log('InitFramework')

//-------------------------- uTool --------------------------//
if (window.uTool == null) {
    window.uTool = {};  
}

// cc.log('InitTool')

import md5 from './tool/md5';
uTool.md5 = md5;

import UtilMgr from './tool/UtilMgr';
uTool.UtilMgr = UtilMgr;

import base64 from './tool/base64';
uTool.Base64 = base64.Base64;

import IDCard from './tool/IDCard';
uTool.IDCard = IDCard;

//-------------------------- unit --------------------------//
if (window.unit == null) {
    window.unit = {};  
}

// log
import LogMgr from './manager/LogMgr';
// unit.log = LogMgr.log.bind(LogMgr);
// unit.warn = LogMgr.warn.bind(LogMgr);
// unit.error = LogMgr.error.bind(LogMgr);
unit.log = function (tag, ...subst) {
    LogMgr.log(tag, ...subst);
};
unit.warn = function (tag, ...subst) {
    LogMgr.warn(tag, ...subst);
};
unit.error = function (tag, ...subst) {
    LogMgr.error(tag, ...subst);
};

// HotUpdate
import HotUpdateMgr from './manager/HotUpdateMgr';
unit.HotUpdateMgr = HotUpdateMgr;

// 着色器
import ShaderMgr from './shader/ShaderMgr';
unit.ShaderMgr = ShaderMgr;
import ShaderDef from './shader/ShaderDef';
unit.EffectDef = ShaderDef.EffectDef;

// 全局事件
import GlobalEvent from './manager/GlobalEvent';
unit.GlobalEvent = GlobalEvent;

// 事件管理
import EventDispatcher from './event/EventDispatcher';
unit.EventDispatcher = EventDispatcher;

// 线程管理
import ThreadMgr from './thread/ThreadMgr';
unit.ThreadMgr = ThreadMgr;

// 内存
import MemoryDetector from './manager/MemoryDetector';
unit.MemoryDetector = MemoryDetector;

// 资源管理
import ResMgr from './manager/ResMgr';
unit.ResMgr = ResMgr;

// Audio
import AudioMgr from './manager/AudioMgr';
unit.AudioMgr = AudioMgr;
AudioMgr.setAudioPath('Audio');

// 加载管理
import LoadMgr from './manager/LoadMgr';
unit.LoadMgr = LoadMgr;

// 场景管理
import SceneMgr from './manager/SceneMgr';
unit.SceneMgr = SceneMgr;
SceneMgr.setLoading('Loading');

// 预制体管理
import PoolManager from './manager/pool/PoolManager';
unit.PoolManager = PoolManager;

import PoolDef from './manager/pool/PoolDef';
unit.PoolDef = PoolDef;

// 对话框管理
import DialogMgr from './manager/dialog/DialogMgr';
unit.DialogMgr = DialogMgr;

import DialogDef from './manager/dialog/DialogDef';
unit.DialogDef = DialogDef;
unit.DialogID = DialogDef.DialogID;

// HTTP
import IHttp from './net/IHttp';
unit.IHttp = IHttp;

// Platform
import PlatformHelper from './unit/PlatformHelper';
unit.PlatformHelper = PlatformHelper;

// SDK
import SDKMgr from './sdk/SDKMgr';
unit.SDKMgr = SDKMgr;

// Transition
import Transition from './unit/Transition';
unit.Transition = Transition;

// Transition
import GuideHelper from './unit/guide/GuideHelper';
unit.GuideHelper = GuideHelper;

// 注册预制体
function __RegisterPrefab__()
{
    let PoolManager = require("PoolManager")
    let PoolDef = require("PoolDef")

    for (const pool_id in PoolDef) {
        const url = PoolDef[pool_id];
        PoolManager.initPool(pool_id, url);
    }
    PoolManager.debugPool();
};

// 注册对话框
function __RegisterDialog__()
{
    let PoolManager = require("PoolManager")
    let DialogDef = require("DialogDef")

    for (const dialog_id in DialogDef.DialogID) {
        const url = DialogDef.DialogID[dialog_id];
        // console.log(dialog_id, url)
        PoolManager.initPool(dialog_id, url);
    }

    PoolManager.debugPool();
};

__RegisterPrefab__();
__RegisterDialog__();