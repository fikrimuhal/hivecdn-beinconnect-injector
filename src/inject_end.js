function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    
    var sc3 = document.createElement("script");
    sc3.setAttribute("src", "https://static.hivecdn.com/hivecdnjs-demo-plugin.production.min.js?v="+Date.now());
    node.appendChild(sc3);
}


chrome.storage.sync.get(['inject'], function(conf) {
    console.log('conf retrieved', conf)
    if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
        injectScript(chrome.extension.getURL('start.js'), 'body');
    }
});




