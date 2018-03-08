const debugTable = `
<div class="debugConsole" style="background: rgba(0,0,0,0.5);
    color: white;
    position: fixed;
    right: 0;
    top: 0;
    margin-top: 10px;
    margin-right: 10px;
    width: 250px;
    min-height: 100px;
    padding: 10px;
    font-size: 10px;
    z-index: 99999999;
">
<table>
                        <tbody>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Connected Peer= <strong class="connectedPeer" style="color:green;font-size: 12px"></strong>
                                </td>
                                
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Total Download(mb)= <strong class="totalDownload" style="color:green;font-size: 12px"></strong>
                                </td>
                               
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Total Upload(mb) = <strong class="totalUpload" style="color:green;font-size: 12px"></strong>
                                </td>
                                
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Http Download(mb)= <strong class="httpDownload" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P Download(mb) =  <strong class="p2pDownload" style="color:green;font-size: 12px"></strong>
                                </td>
                               
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P Upload(mb) =  <strong class="p2pUpload" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P/Total (%) =  <strong class="p2pPercent" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Http/Total (%) =  <strong class="httpPercent" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P / HTTP =  <strong class="crossPercent" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    DownloadRate (mbps) =   <strong class="downloadRate" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P Download Rate (mbps) =   <strong class="p2pDownloadRate" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    Http Download Rate (mbps)  =   <strong class="httpDownloadRate" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-weight: bold;
                                    font-size: 11px;
                                    display: run-in !important;">
                                    P2P Upload Rate (mbps) =   <strong class="p2pUploadRate" style="color:green;font-size: 12px"></strong>
                                </td>
                            </tr>
                 
                        </tbody>


                    </table>
</div>
`;


function checkLoaded(variable, interval, maxCount) {
    var count = 0;
    return new Promise(function (resolve, reject) {
        var isLoaded = false;
        var timerId = setInterval(function () {
            count++;
            isLoaded = (window[variable] !== undefined);
            console.log('module load checker:  ', variable, isLoaded);
            if (count === maxCount || isLoaded) {
                console.log('module load checker finished', count, " isLoaded", isLoaded, window[variable]);
                finish();
            }
        }, interval);
        
        function finish() {
            console.log('EXT: -> ' + variable + 'loaded');
            clearTimeout(timerId);
            resolve(isLoaded);
        }
    });
}

setTimeout(function () {
    checkLoaded('hivecdn', 250, 100).then(function (hivecdnLoaded) {
        if (hivecdnLoaded) {
            checkLoaded('bitmovin', 250, 100).then(function (bitmovinLoaded) {
                if (bitmovinLoaded) {
                    setTimeout(function () {
                        window.hivecdn.settings({
                            siteId: 'beinconnect'
                        });
                        var playerContainer = existsElement('playerLiveTvBitmovin') ? "playerLiveTvBitmovin" : existsElement('player') ? "player" : undefined;
                        // noinspection EqualityComparisonWithCoercionJS
                        if (playerContainer !== undefined && window.bitmovin != undefined && window.bitmovin.player != undefined) {
                            const player = bitmovin.player(playerContainer);
                            console.log("Player instance", player);
                            const setupPlayer = function () {
                                if (player.getConfig().source.dash !== undefined) {
                                    const url = hivecdn.util.url.removeQueryString(player.getConfig().source.dash);
                                    window.hivecdn.registerPlayer(player, hivecdn.PlayerVendors.BITMOVIN, url, hivecdn.StreamTypes.DASH);
                                } else if (player.getConfig().source.hls !== undefined) {
                                    const url = hivecdn.util.url.removeQueryString(player.getConfig().source.hls);
                                    window.hivecdn.registerPlayer(player, hivecdn.PlayerVendors.BITMOVIN, url, hivecdn.StreamTypes.HLS);
                                }
                            };
                            if (player !== undefined) {
                                if (player.isReady()) setupPlayer(); else {
                                    player.addEventHandler('onReady', function (event) {
                                        console.log("Player is ready", player);
                                        setupPlayer();
                                    });
                                    
                                }
                            } else {
                                console.log("player not found in this page");
                            }
                        } else {
                            console.log("bitmovin yüklenemedi", window.bitmovin);
                        }
                        
                        
                    }, 100);
                    
                } else {
                    console.log('EXT: -> bitmovin not loaded');
                }
            });
            
        } else {
            console.log('EXT: -> hivecdn not loaded');
        }
    });
    
    
}, 1000);


var isShowing = false;

function existsElement(id) {
    return document.getElementById(id) !== null;
}

function doc_keyUp(e) {
    
    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.ctrlKey && e.keyCode == 72) {
        // call your function to do the thing
        if (isShowing) {
            $('.debugConsole').remove();
            isShowing=false
        } else {
            $('body').prepend(debugTable);
            isShowing=true
            
        }
    }
}

document.addEventListener('keyup', doc_keyUp, false);
