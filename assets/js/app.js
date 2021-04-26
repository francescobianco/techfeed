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

    function onPlayerReady(event) {
        player.playVideo();
        //inbox()
        //event.target.playVideo();
    }

    function getVideoId(url) {
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    }

    function loadFeed(feed, feeds, callback) {
        console.log("FEED:", feed)
        var nextTitle = null
        var currentVideo = null
        var history = getHistory()
        $.get(feed, function(xml) {
            $(xml).find('item').each(function() {
                var link = $('link', this).text()
                console.log("URL:", link)
                if (!history.includes(getVideoId(link))) {
                    if (currentVideo === null) {
                        currentVideo = link
                        player.loadVideoByUrl(link);
                    } else if (nextTitle === null) {
                        nextTitle = $('title', this).text()
                    }
                }
            })
            callback(feeds, currentVideo, nextTitle)
        })
    }

    function nextFeed(feeds, currentVideo, nextTitle) {
        if (feeds.length > 0) {
            if (nextTitle === null || currentVideo === null) {
                loadFeed(feeds.shift(), feeds, nextFeed)
            }
        } else {
            console.log("NO FEED");
        }
    }

    function loadVideo() {
        var feeds = ['feed/inbox.xml', 'feed/shuffle.xml'];
        loadFeed(feeds.shift(), feeds, nextFeed)
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

    function mark(url) {
        var history = getHistory()
        history.push(getVideoId(url))
        localStorage.setItem('history', JSON.stringify(history));
    }
})($)
