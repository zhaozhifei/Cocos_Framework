

module.exports = {

    m_readBuffer : '',
    m_fullPath : '/storage/emulated/0/AJavgame/',
    m_logPath : '',     

    log(tag, ...subst)
    {
        this._writeLog('log', tag, ...subst);
    },

    warn(tag, ...subst)
    {
        this._writeLog('warn', tag, ...subst);
    },

    error(tag, ...subst)
    {
        this._writeLog('error', tag, ...subst);
    },

    _writeLog(type, tag, ...subst)
    {
        if (!uConfig.PRINTLOG) {
            return;
        }

        if (type == 'log') {
            console.log(tag, ...subst);
        } 
        else if (type == 'warn') {
            console.warn(tag, ...subst);
        }
        else if (type == 'error') {
            console.error(tag, ...subst);
        }

        
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) {
            this._writeToFile(type, tag, ...subst);
        }
    },

    _creatFile()
    {
        if (this.m_logPath != '') {
            return;
        }

        if(!jsb.fileUtils.isDirectoryExist(this.m_fullPath)) {
            jsb.fileUtils.createDirectory(this.m_fullPath);
        }
        else {
            console.error('dir is exist!!!', this.m_fullPath);
        }

        var fileName = 'log_' + uTool.UtilMgr.timeToString(new Date(), 'yyMMddhhmmss') + '.txt';
        this.m_logPath = this.m_fullPath + fileName;
    },

    _writeToFile(type, tag, ...subst)
    {
        this._creatFile();

        if (tag == null) { tag = ''; }
        var sTag = JSON.stringify(tag);
        var sMsg = this._getParamString(...subst);
        var sTime = uTool.UtilMgr.timeToString(new Date(), 'yy-MM-dd hh:mm:ss');

        this.m_readBuffer += '[';
        this.m_readBuffer += sTime;
        this.m_readBuffer += ']';
        this.m_readBuffer += '[';
        this.m_readBuffer += type;
        this.m_readBuffer += '] ';
        this.m_readBuffer += sTag;
        this.m_readBuffer += ':';
        this.m_readBuffer += sMsg;
        this.m_readBuffer += '\n';

        if (this.m_logPath != '') {
            jsb.fileUtils.writeStringToFile(this.m_readBuffer, this.m_logPath);
        }
    },

    _getParamString(...param)
    {
        var paramStr = '';
        for (let index = 0; index < param.length; index++) {
            const element = param[index];
            paramStr += JSON.stringify(element);
        }
        return paramStr;
    },
    
    _stack() {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({[lineBreak[0]]: lineBreak[1]});
            }
        });

        // return result;
    
        var list = [];

        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    list.push(key);
                }
            }
        }

        // return list;
        return list.toString();
    },
};