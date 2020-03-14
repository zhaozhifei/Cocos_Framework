module.exports = {
    funcArray: new Array(),

    addCall:function(name,func,target)
    {
        let obj = {};
        obj.name = name;
        obj.func = func;
        obj.target = target;
        this.funcArray.push(obj);
    },

    removeCallByTargetAndName:function(target,name)
    {
        var i = this.funcArray.length - 1;
        var o;
        for(i; i >=0; i--)
        {
            o = this.funcArray[i];
            if(o.name == name && o.target == target){
                this.funcArray.splice(i, 1);
            }
        }
    },

    removeCallByTarget:function(target)
    {
        var i = this.funcArray.length - 1;
        var o;
        for(i; i >=0; i--)
        {
            o = this.funcArray[i];
            if(o.target == target){
                this.funcArray.splice(i, 1);
            }
        }
    },

    callFunc(name,param)
    {
        var i;
        var o;
        for(i in this.funcArray){
            o = this.funcArray[i];
            if(name == o.name){
                o.func(param);
            }
        }
    }
};