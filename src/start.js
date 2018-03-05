function checkLoaded(variable, interval, maxCount) {
    var count=0;
    return new Promise(function (resolve, reject) {
        var isLoaded = false;
        var timerId = setInterval(function () {
            count++;
            isLoaded = (window[variable] !== undefined);
            console.log('module load checker:  ',variable,isLoaded)
            if (count === maxCount || isLoaded){
                console.log('module load checker finished',count," isLoaded",isLoaded,window[variable])
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
                        if (playerContainer !== undefined  && window.bitmovin != undefined  && window.bitmovin.player != undefined) {
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
                        }else {
                            console.log("bitmovin yüklenemedi",window.bitmovin)
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


function existsElement(id) {
    return document.getElementById(id) !== null;
}