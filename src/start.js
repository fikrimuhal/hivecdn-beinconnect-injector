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
                //const player = bitmovin.player('playerLiveTvBitmovin');
                if (document.getElementById('player') !== undefined) {
                    const player = bitmovin.player('player');
                    player.addEventHandler('onReady', function (event) {
                        const url = player.getConfig().source.dash;
                        hivecdn.registerPlayer(player, hivecdn.PlayerVendors.BITMOVIN, url, hivecdn.StreamTypes.DASH);
                    });
                }
                
            } else {
                console.log('EXT: -> hivecdn not loaded');
            }
        });
    } else {
        console.log('EXT: -> bitmovin not loaded');
    }
});




