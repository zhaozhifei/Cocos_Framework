/*
 * @Author: mengjl
 * @Date: 2019-12-15 14:38:54
 * @LastEditTime: 2019-12-16 13:58:54
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \NewResProject\assets\Script\Frameworks\manager\shader\ShaderMgr.js
 */

let ShaderDef = require("ShaderDef")

module.exports = {

    effectAssets : new Array(),

    __init__()
    {
        // cc.log('__init__')
        cc.game.on(cc.game.EVENT_ENGINE_INITED, () => {
            cc.loader.loadResDir('Effects', cc.EffectAsset, (error, res) => {
                if (error) {
                    return;
                }
                for (let index = 0; index < res.length; index++) {
                    this.effectAssets[res[index]._name] = res[index];
                }
                // this.effectAssets[] = res;
            });
        });
    },

    _getEffectAsset(effect_enum)
    {
        var effect_name = ShaderDef.EffectDef[effect_enum];

        return this.effectAssets[effect_name];
    },

    _createMaterial(effectAsset)
    {
        //实例化一个材质对象
        let material = new cc.Material();

        //在材质对象上开启USE_TEXTURE定义s
        material.define('USE_TEXTURE', true);

        //为材质设置effect，也是就绑定Shader了
        material.effectAsset = effectAsset;
        material.name = effectAsset.name;

        return material;
    },

    setShader(target, effect_enum)
    {
        let sprite = target.getComponent(cc.Sprite);
        if (!sprite) {
            return;
        }

        let effectAsset = this._getEffectAsset(effect_enum);
        if (!effectAsset) {
            return;
        }

        //实例化一个材质对象
        let material = this._createMaterial(effectAsset);
        
        //将材质绑定到精灵组件上，精灵可以绑定多个材质
        //这里我们替换0号默认材质
        sprite.setMaterial(0, material);
    },
};

module.exports.__init__();