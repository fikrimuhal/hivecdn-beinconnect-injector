function injectScript(file_path, tag, id) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    if (id !== undefined) script.setAttribute('id', id);
    node.appendChild(script);
}


chrome.storage.sync.get(['inject'], function (conf) {
    if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
        injectScript(chrome.extension.getURL('start.js'), 'body');
    }
});






