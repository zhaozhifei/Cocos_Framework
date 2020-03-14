const MemoryDetector = {
    _inited: false,

    showMemoryStatus() {
        if (cc.sys.isNative) {
            return;
        }

        let _memLabel = null;
        let profiler = cc.profiler;
        profiler.showStats();

        let createMemLabel = function () {
            let node = new cc.Node();
            node.y = cc.winSize.height - 20;
            node.anchorX = 0;
            _memLabel = node.addComponent(cc.Label);
            _memLabel.fontSize = 20;
            cc.director.getScene().addChild(node);
        }

        createMemLabel();

        let afterVisit = function () {
            let totalBytes = 0;
            var size = 0;
            var caches = cc.loader._cache;
            for (const id in caches) {
                var asset = cc.loader.getRes(id);
            
                if (asset instanceof cc.Texture2D) {
                    // console.log(asset)
                    if (asset.width && asset.height && asset._format) {
                        size = asset.width * asset.height * asset._format / 4;
                        totalBytes += size;
                    }
                }
                else if (asset instanceof cc.SpriteFrame) {
                    if (asset._originalSize && asset._texture) {
                        size = asset._originalSize.width * asset._originalSize.height * asset._texture._format / 4;
                        totalBytes += size;
                    }
                }
            }
            
            if (cc.isValid(_memLabel)) {
                _memLabel.string = "  Memory  " + (totalBytes / (1024.0 * 1024.0)).toFixed(4) + " M";
            }
            
        }

        cc.director.on(cc.Director.EVENT_BEFORE_DRAW, afterVisit);
        this._inited = true;
    },
}

module.exports = MemoryDetector;
