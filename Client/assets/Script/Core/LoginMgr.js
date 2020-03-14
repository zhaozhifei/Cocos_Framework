/*
 * @Author: mengjl
 * @Date: 2020-02-25 09:45:28
 * @LastEditTime: 2020-02-25 16:11:26
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Core\LoginMgr.js
 */


module.exports = {

    onRegster(username, userpass, realName, IDCard, callback)
    {
        var url = window.ServerFuncUrl.Base + window.ServerFuncUrl.Register;
        var params = {
            rType : 1,
            username : username,
            userpass : userpass,
            realName : realName,
            IDCard : IDCard,
            inviteId : 0,
            mac : '',
            app : 'plane',
            platform : 'app_web_test',
        };

        var sParams = JSON.stringify(params);

        this.send(window.ServerFuncUrl.Register, params, (resp)=>{
            if (resp && resp.errcode == 0) {
                window.SystemInfo.serverStringId = resp.userid;
            }
            if (callback) {
                callback(resp);
            }
        });
    },

    onLogin(username, userpass, callback)
    {
        var params = {
            rType : 2,
            username : username,
            userpass : userpass,
            realName : '',
            IDCard : '',
            mac : '',
            inviteId : 0,
            app : 'plane',
            platform : 'app_web_test',
        };

        this.send(window.ServerFuncUrl.Register, params, (resp)=>{
            console.error(resp)
            if (resp && resp.errcode == 0) {
                window.SystemInfo.serverStringId = resp.userid;
            }
            
            if (callback) {
                callback(resp);
            }
        });
    },

    send(method_name, params = null, callback = null, timeout = 5000)
    {
        var sParams = '';
        if (params == null) {
            params = {};
        }

        var url = window.ServerFuncUrl.Base + method_name;
        
        let Utils = require("Utils");
        params.secretkey = Utils.paramsToMd5(url, params);
        // params.secretkey = this.getSecretkey(method_name, JSON.stringify(params), window.secretkey);
        console.error(params, window.secretkey);
        sParams = JSON.stringify(params);

        unit.IHttp.post(url, sParams, callback, timeout, {'Content-Type' : 'application/x-www-form-urlencoded'});
    },

    getSecretkey(method_name, sParams, key)
    {
        // unit.error(method_name, sParams, key)
        let md5 = require("md5");
        var str = method_name + sParams + key;
        console.error(str)
        params.secretkey = Utils.paramsToMd5(url,params);
        return md5.md5(str);
    },

    isExitChinese(strinfo) {
        var reg = /^[a-zA-Z0-9]+$/;
        if (!reg.test(strinfo)) {
            return true;
        } else {
            return false;
        }
    },

    getAllAccounts()
    {
        var all_accounts = cc.sys.localStorage.getItem('all_accounts');
        // console.error(all_accounts)
        if (!all_accounts) {
            return {};
        }
        return JSON.parse(all_accounts);
    },

    saveAccounts(account, password)
    {
        var all_accounts = this.getAllAccounts();
        all_accounts[account] = password;
        cc.sys.localStorage.setItem('all_accounts', JSON.stringify(all_accounts));
    },
};