var stats={
    totalDownload:0,
    totalUpload:0,
    cdnDownload:0,
    p2pDownload:0,
    p2pUpload:0,
    p2pPercent: 0,
    httpPercent: 0,
    crossPercent: 0,
    currentDownloadRate:0,
    currentP2pDownloadRate:0,
    currentHttpDownloadRate:0,
    currentUploadRate:0,
    connectedPeer: 0
}

var ctx = document.getElementById("myChart").getContext('2d');
data = {
    datasets: [{
        backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
        data: [0, 0, 0]
    }],
    labels: ['P2P', 'CDN', 'CACHE']
    
};
var myChart = new Chart(ctx, {
    type: 'doughnut', data: data
});

window.addEventListener("message", function(event) {
    console.log('addEventListener-message',event)
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    
    if (event.data.type && (event.data.to === "extention")) {
        //{to: "extention", cmd: "stat_changed", payload: lastValues};
         stats = event.data.payload;
        updateChart();
        console.log("Content script received message: " + event.data);
    }
});

function updateChart(){
    const cdn = stats.cdnDownload;
    const p2p = stats.cdnDownload;
    const cache = 0;
    myChart.data.datasets.data = [p2p,cdn,cache];
    myChart.update();
}



chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        console.log('port msg - ext')
        if (msg.joke == "Knock knock")
            port.postMessage({question: "Who's there?"});
        else if (msg.answer == "Madame")
            port.postMessage({question: "Madame who?"});
        else if (msg.answer == "Madame... Bovary")
            port.postMessage({question: "I don't get it."});
    });
});