let Utils = require("Utils");
module.exports = {
    httpGets: function (url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                if(xhr.status >= 200 && xhr.status < 300) {
                    var respone = xhr.responseText;
                    var resJson = JSON.parse(xhr.responseText)
                    callback(resJson);
                }else{
                    callback(null);
                }
            }
        };
        xhr.open("GET", url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
        xhr.send();
    },
    
    httpPost: function (url, params, callback,postNum) {
        //if(cc.sys.platform != cc.sys.WECHAT_GAME) {
            // params = this.paramsParse(params);
        //}
        //延迟6秒后自动失败
        let isxhrReady = false;
        setTimeout(function(){
            if(isxhrReady == true){
                return;
            }
            console.log("httpPost Timeout params:" + JSON.stringify(params));
            isxhrReady = true;
            callback(null);
        },6000);
        
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            cc.log('xhr.readyState=' + xhr.readyState + ' xhr.status=' + xhr.status);
            if (xhr.readyState === 4){
                if(isxhrReady == true){
                    return;
                }
                isxhrReady = true;
                if(xhr.status >= 200 && xhr.status < 300) {
                    var respone = xhr.responseText;
                    console.log(JSON.parse(respone));
                    var resJson = JSON.parse(respone)
                    callback(resJson);
                }else{
                    callback(null);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        // note: In Internet Explorer, the timeout property may be set only after calling the open()
        // method and before calling the send() method.
        xhr.timeout = 5000;// 5 seconds for timeout
        // params.secretkey = window.secretkey;
        params.secretkey = Utils.paramsToMd5(url,params);
        console.log("httpPost url:" + url + " params:" + JSON.stringify(params));
        xhr.send(JSON.stringify(params));
    },

    paramsParse: function(params){
        let retStr = "";
        for (let k in params) {
            let v = params[k];
            if(typeof(v) == "object"){
                v = JSON.stringify(v);
            }
            if(retStr != ""){
                retStr += "&";
            }
            retStr += (k + "=" + v);
        }
        return retStr;
    }
};
