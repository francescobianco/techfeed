(function($){
    var player;

    $.getScript('https://www.youtube.com/iframe_api');
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            events: {
                'onReady': loadVideo,
                'onStateChange': function(event) {
                    console.log('STATE:', event.data);
                    if (event.data === YT.PlayerState.ENDED) {
                        markVideo(player.getVideoUrl())
                        loadVideo()
                    }
                }
            }
        })
    }

    $(document).ready(welcome)

    function onPlayerReady(event) {
        player.playVideo();
        //inbox()
        //event.target.playVideo();
    }

    function getVideoId(url) {
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    }

    function loadFeed(feed, feeds, callback, currentVideo, nextTitle) {
        console.log('LF', feed, currentVideo, nextTitle)
        var history = getHistory()
        $.get(feed, function(xml) {
            $(xml).find('item').each(function() {
                var videoId = getVideoId($('link', this).text())
                if (!history.includes(videoId)) {
                    if (currentVideo === null) {
                        currentVideo = videoId
                        player.loadVideoById(videoId);
                    } else if (nextTitle === null) {
                        nextTitle = $('title', this).text()
                    }
                }
            })
            callback(feeds, currentVideo, nextTitle)
        })
    }

    function nextFeed(feeds, currentVideo, nextTitle) {
        if (nextTitle === null || currentVideo === null) {
            if (feeds.length > 0) {
                loadFeed(feeds.shift(), feeds, nextFeed, currentVideo, nextTitle)
            } else if (currentVideo === null) {
                player.loadVideoById('H868NSM2yAg');
            } else {
                console.log("No next");
            }
        } else {
            console.log("FINALE: ", currentVideo, nextTitle);
        }
    }

    function loadVideo() {
        var feeds = ['feed/inbox.xml', 'feed/shuffle.xml'];
        loadFeed(feeds.shift(), feeds, nextFeed, null, null)
    }

    function getHistory() {
        if (typeof localStorage.history === 'undefined') {
            return []
        }
        try {
            var history = JSON.parse(localStorage.getItem('history'))
            return Array.isArray(history) ? history : []
        } catch (error) {
            return [];
        }
    }

    function markVideo(url) {
        var history = getHistory()
        history.push(getVideoId(url))
        localStorage.setItem('history', JSON.stringify(history));
    }

    function welcome() {
        if (typeof localStorage.getItem('welcome') == 'undefined' || true) {
            $('#modal .title').text('Benvenuto!');
            $('#modal').show();
            //localStorage.setItem('welcome', 'done')
        }
    }
})($)
