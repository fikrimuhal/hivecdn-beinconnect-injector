var debug = false;
document.addEventListener("DOMContentLoaded", function () {
    console.log("document ready oldu");
    chrome.storage.sync.get(['inject'], function (conf) {
        if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
            var scripts = ['https://static.hivecdn.com/hivecdn.production.min.js', 'https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.production.min.js'];
            var dev_scripts = ['http://mesut.ofis:9001/hivecdnv2client-fastopt-bundle.js', 'http://192.168.2.11:5010/hivecdnjs-bitmovin-plugin.min.js', 'http://mesut.ofis:5005/hivecdnjs-demo-plugin.min.js'];
            injectLibraries(debug ? dev_scripts : scripts);
        }
    });
    
    
    function injectLibraries(links) {
        links.forEach(function (src) {
            inject(src);
        });
    }
    
    function inject(src) {
        var _scriptElement = document.createElement("script");
        _scriptElement.setAttribute("src", src + "?v=" + Date.now());
        _scriptElement.async = false;
        document.documentElement.appendChild(_scriptElement);
    }
});
