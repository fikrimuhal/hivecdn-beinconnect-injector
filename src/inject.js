// if (localStorage.inject === undefined || localStorage.inject === "true") {
//     injectLibraries();
// }


chrome.storage.sync.get(['inject'], function(conf) {
    console.log('conf retrieved', conf)
    if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
        injectLibraries();
    }
});


function injectLibraries() {
    var sc1 = document.createElement("script");
    var sc2 = document.createElement("script");
//var sc3 = document.createElement("script");
    sc1.setAttribute("src", "https://static.hivecdn.com/hivecdn.min.js");
    sc2.setAttribute("src", "https://static.hivecdn.com/hivecdnjs-bitmovin-plugin.min.js");
//sc3.setAttribute("src", "https://static.hivecdn.com/hivecdnjs-demo-plugin.min.js");
    sc1.async = false;
    sc2.async = false;
//sc3.async = false;
    document.documentElement.appendChild(sc1);
    document.documentElement.appendChild(sc2);
//document.documentElement.appendChild(sc3);
}