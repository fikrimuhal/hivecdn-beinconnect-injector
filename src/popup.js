$('#tabConnectionStatus').html("waiting ...");
var selectedPlayerVendor = "bitmovin"
var selectedContaierId = undefined
var stats = {
    totalDownload: 0,
    totalUpload: 0,
    cdnDownload: 0,
    p2pDownload: 0,
    p2pUpload: 0,
    p2pPercent: 0,
    httpPercent: 0,
    crossPercent: 0,
    currentDownloadRate: 0,
    currentP2pDownloadRate: 0,
    currentHttpDownloadRate: 0,
    currentUploadRate: 0,
    connectedPeer: 0
};

// var ctx = document.getElementById("myChart").getContext('2d');
// data = {
//     datasets: [{
//         backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
//         data: [0, 0, 0]
//     }], labels: ['P2P', 'CDN', 'CACHE']
//
// };
// var myChart = new Chart(ctx, {
//     type: 'doughnut', data: data, options: {
//         title: {
//             display: true, text: 'Data Source Distribution (in MB)'
//         }
//     }
//
// });


function updateChart() {
    const cdn = stats.cdnDownload / 1000000;
    const p2p = stats.p2pDownload / 1000000;
    const cache = 0 / 1000000;
    myChart.data.datasets[0].data = [p2p, cdn, cache];
    myChart.update();
    
}

function updateStat() {
    console.log("updateStat called")
    $('.totalDownload').html((stats.totalDownload / (1024 * 1024)).toFixed(2));
    $('.totalUpload').html((stats.totalUpload / (1024 * 1024)).toFixed(2));
    $('.httpDownload').html((stats.cdnDownload / (1024 * 1024)).toFixed(2));
    $('.p2pDownload').html((stats.p2pDownload / (1024 * 1024)).toFixed(2));
    $('.p2pUpload').html((stats.p2pUpload / (1024 * 1024)).toFixed(2));
    $('.p2pPercent').html(stats.p2pPercent.toFixed(2));
    $('.httpPercent').html(stats.httpPercent.toFixed(2));
    $('.crossPercent').html(stats.crossPercent.toFixed(2));
    $('.connectedPeer').html(stats.connectedPeer);
}

(function () {
    var port = undefined
    chrome.runtime.onConnectExternal.addListener(function (remotePort) {
        port = remotePort
        console.log('chrome.runtime.onConnect.addListener',remotePort)
        $('#tabConnectionStatus').html("connected");
        port.postMessage({
            command:"autoStart",
            payload:{}
        })
    })
})();

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    console.log('message received', request);
    if (sender.url.indexOf('beinconnect') === -1) return;

    if (request.to === "extention") {
        //{to: "extention", cmd: "stat_changed", payload: lastValues};
        stats = request.payload;
        // updateChart();
        // updateStat();
        sendResponse("[extention] statları aldım")
    }
});


chrome.storage.sync.get(['inject'], function (conf) {
    
    if (conf !== undefined && (conf.inject === undefined || conf.inject === "true")) {
        $('#chEnabled').prop('checked', true).change();
    } else {
        $('#chEnabled').prop('checked', false).change();
    }
});

$('#chEnabled').change(function () {
    var checked = $('#chEnabled').prop('checked') ? "true" : "false";
    chrome.storage.sync.set({'inject': checked}, function () {
        console.log('Settings saved');
    });
});

$('input[name=playerVendor]').change(function () {
    selectedPlayerVendor = $(this).val()
    console.log("selectedPlayerVendor",selectedPlayerVendor)
    if(selectedPlayerVendor === "bitmovin"){
        $('#bitmovinContainerId').show()
    }else{
        $('#bitmovinContainerId').hide()
    }
})

// $('#btnStart').click(function () {
//     selectedContaierId =$('#bitmovinContainerId').val();
//     if(selectedPlayerVendor==="bitmovin" && (selectedContaierId === "" || selectedContaierId===undefined ) ){
//         alert("Container ID must not empty")
//         return;
//     }
//     if(!port){
//         alert("No tab connection")
//         return;
//     }
//     port.postMessage({
//         command:"registerPlayer",
//         payload:{
//             playerVendor:selectedPlayerVendor,
//             containerId: selectedContaierId
//         }
//     })
// });
// $('#btnDebugConsole').click(function () {
//     port.postMessage({
//         command:"debugConsoleActivate"
//     })
// });