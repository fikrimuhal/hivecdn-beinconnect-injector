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

function enableDebugConsole() {
    window.hivecdn.debugConsole.activate("")

    function doc_keyUp(e) {
        if (e.ctrlKey && (e.keyCode === 72 || e.keyCode === 77)) window.hivecdn.debugConsole.toogle();
    }

    document.addEventListener('keyup', doc_keyUp, false);

}

function existsElement(id) {
    return document.getElementById(id) !== null;
}


const hivecdnLoadFuture = function () {
    return checkLoaded('hivecdn', 250, 500)
};
const bitmovinLoadFuture = function () {
    return checkLoaded('bitmovin', 250, 500)
}

setTimeout(function () {
    checkLoaded('hivecdn', 250, 500).then(function (hivecdnLoaded) {
        if (hivecdnLoaded) {
            window.hivecdn.settings({
                siteId: 'hivecdn_dev-0000-0000-0000'
            });
            // enableDebugConsole();
        } else {
            console.log('EXT: -> hivecdnjs not loaded');
        }
    });
}, 1000);





