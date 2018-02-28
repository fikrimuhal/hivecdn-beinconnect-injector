function checkLoaded(variable, interval, maxCount) {
    var count;
    return new Promise(function (resolve, reject) {
        var isLoaded = false;
        var timerId = setInterval(function () {
            count++;
            isLoaded = window[variable] !== undefined;
            if (count === maxCount || isLoaded) finish();
        }, interval);
        
        function finish() {
            console.log('EXT: -> ' + variable + 'loaded');
            clearTimeout(timerId);
            resolve(isLoaded);
        }
    });
}

checkLoaded('bitmovin', 100, 20).then(function (bitmovinLoaded) {
    if (bitmovinLoaded) {
        checkLoaded('hivecdn', 100, 20).then(function (hivecdnLoaded) {
            if (hivecdnLoaded) {
                hivecdn.settings({
                    siteId: 'beinconnect'
                });
                var playerContainer = existsElement('playerLiveTvBitmovin') ? "playerLiveTvBitmovin" : existsElement('player') ? "player" : undefined;
                if (playerContainer !== undefined) {
                    const player = bitmovin.player(playerContainer);
                    console.log("Player instance", player);
                    const setupPlayer = function () {
                        if (player.getConfig().source.dash !== undefined) {
                            const url = hivecdn.util.url.removeQueryString(player.getConfig().source.dash);
                            hivecdn.registerPlayer(player, hivecdn.PlayerVendors.BITMOVIN, url, hivecdn.StreamTypes.DASH);
                        } else if (player.getConfig().source.hls !== undefined) {
                            const url = hivecdn.util.url.removeQueryString(player.getConfig().source.hls);
                            hivecdn.registerPlayer(player, hivecdn.PlayerVendors.BITMOVIN, url, hivecdn.StreamTypes.HLS);
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
                }
                
            } else {
                console.log('EXT: -> hivecdn not loaded');
            }
        });
    } else {
        console.log('EXT: -> bitmovin not loaded');
    }
});


function existsElement(id) {
    return document.getElementById(id) !== null;
}