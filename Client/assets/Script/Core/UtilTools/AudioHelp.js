/*
 * @Author: mengjl
 * @Date: 2020-02-10 20:00:15
 * @LastEditTime: 2020-02-24 11:00:29
 * @LastEditors: mengjl
 * @Description: 
 * @FilePath: \client\assets\Script\Core\UtilTools\AudioHelp.js
 */
module.exports = {
    playSimpleAudioEngine: function (audiosPath,num) {
        if(window.GameData.getIsEffect() == 0 || window.GameData.getIsEffect() == "0"){
            return;
        }
        cc.loader.loadRes(this.getUrl(audiosPath), cc.AudioClip, (err, audioClip)=>{
            cc.audioEngine.play(audioClip, false, num);
        });
        // cc.audioEngine.play(cc.url.raw("resources/audio/"+audiosPath), false, num);
    },

    playBackAudioEngine: function (audiosPath) {
        if(window.GameData.getIsMusic() == 0 || window.GameData.getIsMusic() == "0"){
            return;
        }
        // cc.audioEngine.play(cc.url.raw("resources/audio/"+audiosPath), true, 0.4);
        cc.loader.loadRes(this.getUrl(audiosPath), cc.AudioClip, (err, audioClip)=>{
            // console.error(err, audioClip);
            cc.audioEngine.play(audioClip, true, 0.4);
        });
    },

    getUrl:function(url){
        return 'audio/' + url;
    },

    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },

    resumeAll:function(){
        cc.audioEngine.resumeAll();
    },

    stopAll:function(){
        cc.audioEngine.stopAll();
        cc.isMusicPlaying = false;
    },
};