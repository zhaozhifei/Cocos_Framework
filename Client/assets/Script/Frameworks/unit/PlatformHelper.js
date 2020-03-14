/*
 * @Author: mengjl
 * @Date: 2019-12-18 13:06:04
 * @LastEditTime : 2020-01-03 14:24:54
 * @LastEditors  : mengjl
 * @Description: 
 * @FilePath: \client\assets\Scripts\Frameworks\unit\PlatformHelper.js
 */

module.exports = {

    callStaticMethod(class_name, method_name, return_name, ...params)
    {
        // unit.log('callStaticMethod', params);
        // unit.log('method_name', method_name);
        // unit.log('MethodSignature', this.getMethodSignature(return_name, ...params));
        if (!cc.sys.isNative) {
            return;
        }

        if (cc.sys.platform == cc.sys.ANDROID) {
            return this.callAndroidMethod(class_name, method_name, return_name, ...params);
        } else if (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD) {
            return this.callIOSMethod(class_name, method_name, ...params);
        }
        else
        {

        }
    },

    getMethodSignature(return_name, ...params)
    {
        var method_signature = '';
        method_signature += '(';
        for (let index = 0; index < params.length; index++) {
            const value = params[index];
            if (typeof value == 'string') {
                method_signature += 'Ljava/lang/String;';
            }
            else if (typeof value == 'boolean') {
                method_signature += 'Z';
            }
            else if (typeof value == 'number') {
                if (Number.isSafeInteger(value)) {
                    method_signature += 'I';
                } else {
                    method_signature += 'F';
                }
            }
        }
        method_signature += ')';

        var return_string = '';
        if (return_name == 'S') {
            return_string = 'Ljava/lang/String;';
        }
        else
        {
            return_string = return_name;
        }

        method_signature += return_string;

        return method_signature;
    },

    callAndroidMethod(class_name, method_name, return_name, ...params)
    {
        var method_signature = this.getMethodSignature(return_name, ...params);

        return jsb.reflection.callStaticMethod(class_name, method_name, method_signature, ...params);  
    },

    callIOSMethod(class_name, method_name, ...params)
    {

    },

    getWritablePath()
    {
        if (!cc.sys.isNative) {
            return '';
        }
        return jsb.fileUtils.getWritablePath();
    },

    getFileUtils()
    {
        if (!cc.sys.isNative) {
            return null;
        }

        return jsb.fileUtils;
    }
};