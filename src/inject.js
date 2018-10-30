/**
 * development,stage,production
 * @type {string}
 */
var env = "production";
const bitmovinScripts = {
    production: {
        src: 'https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.production.min.js'
    },
    stage: {
        src: 'https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.master.min.js'
    },
    development: {
        src: 'http://192.168.2.11:5010/hivecdnjs-bitmovin-plugin.min.js'
    }
};
const videoJSScripts = {
    production: {
        src: 'https://static.hivecdn.com/hivecdnjs-videojs-plugin.production.min.js'
    },
    stage: {
        src: 'https://static.hivecdn.com/hivecdnjs-videojs-plugin.master.min.js'
    },
    development: {
        src: 'http://192.168.2.11:5020/hivecdnjs-videojs-plugin.min.js'
    }
};
const demoPluginScripts = {
    production: {
        src: 'https://static.hivecdn.com/hivecdnjs-demo-plugin.production.min.js'
    },
    stage: {
        src: 'https://static.hivecdn.com/hivecdnjs-demo-plugin.master.min.js'
    },
    development: {
        src: 'http://192.168.2.11:5005/hivecdnjs-demo-plugin.min.js'
    }
};
const hivecdnjsScripts = {
    production: {
        src: 'https://static.hivecdn.com/hivecdn.production.min.js', id: "hivecdnScript"
    },
    stage: {
        src: 'https://static.hivecdn.com/hivecdn.min.js', id: "hivecdnScript"
    },
    development: {
        src: 'http://192.168.2.11:9001/hivecdnv2client-fastopt-bundle.js', id: "hivecdnScript"
    }
};
var scripts = {
    production: [hivecdnjsScripts.production,
        bitmovinScripts.production,
        demoPluginScripts.production,
        videoJSScripts.production

    ],
    development: [hivecdnjsScripts.development, bitmovinScripts.development, demoPluginScripts.development,videoJSScripts.development],
    stage: [hivecdnjsScripts.stage, bitmovinScripts.stage, demoPluginScripts.stage,videoJSScripts.stage]
};
document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.sync.get(['inject'], function (conf) {
        if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
            injectLibraries(scripts[env]);
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


chrome.runtime.onConnect.addListener(function (port) {
    console.log('chrome.runtime.onConnect.addListener',port)
})