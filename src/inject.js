var debug = false;
var scripts = {
    production: [{
        src: 'https://static.hivecdn.com/hivecdn.production.min.js', id: "hivecdnScript"
    }, {
        src: 'https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.production.min.js'
    }, {
        src: 'https://static.hivecdn.com/hivecdnjs-demo-plugin.production.min.js'
    }
    
    ], development: [{
        src: 'http://192.168.2.11:9001/hivecdnv2client-fastopt-bundle.js', id: "hivecdnScript"
    }, {
        src: 'http://192.168.2.11:5010/hivecdnjs-bitmovin-plugin.min.js'
    }, {
        src: 'http://192.168.2.11:5005/hivecdnjs-demo-plugin.min.js'
    }], stage: [{
        src: 'https://static.hivecdn.com/hivecdn.master.min.js', id: "hivecdnScript"
    }, {
        src: 'https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.master.min.js'
    }, {
        src: 'https://static.hivecdn.com/hivecdnjs-demo-plugin.master.min.js'
    }]
};
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.sync.get(['inject'], function (conf) {
        if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
            injectLibraries(debug ? scripts.development : scripts.production);
        }
    });
    
    
    function injectLibraries(links) {
        links.forEach(function (script) {
            inject(script);
        });
    }
    
    function inject(script) {
        var src = script.src;
        var id = script.id;
        var _scriptElement = document.createElement("script");
        _scriptElement.setAttribute("src", src + "?v=" + Date.now());
        if (id !== undefined) _scriptElement.setAttribute("id", id);
        _scriptElement.async = false;
        document.documentElement.appendChild(_scriptElement);
    }
});
