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

var ctx = document.getElementById("myChart").getContext('2d');
data = {
    datasets: [{
        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
        data: [0, 0, 0]
    }], labels: ['P2P', 'CDN', 'CACHE']
    
};
var myChart = new Chart(ctx, {
    type: 'doughnut', data: data,
    options:{
        title: {
            display: true, text: 'Data Source Distribution (in MB)'
        }
    }
   
});

window.addEventListener("message", function (event) {
    console.log('addEventListener-message', event);
    // We only accept messages from ourselves
    if (event.source != window) return;
    
    
});

function updateChart() {
    const cdn = stats.cdnDownload / 1000000;
    const p2p = stats.p2pDownload / 1000000;
    const cache = 0 / 1000000;
    myChart.data.datasets[0].data = [p2p, cdn, cache];
    myChart.update();
    
}

function updateStat() {
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
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
    if (sender.url.indexOf('beinconnect') === -1) return;
    console.log('message received', request);
    
    if (request.to === "extention") {
        //{to: "extention", cmd: "stat_changed", payload: lastValues};
        stats = request.payload;
        updateChart();
        updateStat();
    }
});