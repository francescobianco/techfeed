(function($){
    var player;

    $.getScript('https://www.youtube.com/iframe_api');
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            events: {
                'onReady': function() {
                    loadVideo()
                },
                'onStateChange': function(event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        markVideo(player.getVideoUrl())
                        loadVideo()
                    }
                }
            }
        })
    }

    $(document).ready(welcome)
    $(document).on('click', '.welcome', welcome)
    $(document).on('click', '.show-more', showMore)
    $('#modal .close').click(() => $('#modal').hide())
    $('#modal .call-to-action').click(() => $('#modal').hide())
    $('#preview .call-to-action').click(function() {
        console.log()
        loadVideo($(this).attr('data-next-video'))
    })

    function getVideoId(url) {
        url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    }

    function loadFeed(feed, feeds, callback, currentVideo, nextTitle) {
        console.log('loadFeed:', feed, currentVideo, nextTitle)
        var history = getHistory()
        $.get(feed+'?ts='+Date.now(), function(xml) {
            var count = 0
            $(xml).find('item').each(function() {
                var videoId = getVideoId($('link', this).text())
                var videoTitle = $('title', this).text()
                if (!history.includes(videoId)) {
                    if (currentVideo === null) {
                        currentVideo = videoId
                        player.loadVideoById(videoId);
                        console.log('play:', videoTitle);
                    } else if (nextTitle === null) {
                        nextTitle = videoTitle
                        $('#preview .title').text(nextTitle)
                        console.log('next:', videoTitle);
                        //$('#preview .call-to-action').attr('data-next-video', videoId)
                    } else {
                        console.log('skipped:', videoTitle);
                    }
                } else {
                    console.log('ignored:', videoTitle);
                }
                count++
            })
            console.log('count:', count)
            callback(feeds, currentVideo, nextTitle)
        })
    }

    function nextFeed(feeds, currentVideo, nextTitle) {
        console.log('nextFeed:', currentVideo, nextTitle)
        if (nextTitle === null || currentVideo === null) {
            if (feeds.length > 0) {
                loadFeed(feeds.shift(), feeds, nextFeed, currentVideo, nextTitle)
            } else if (currentVideo === null) {
                //player.loadVideoById('XIMLoLxmTDw');
                localStorage.removeItem('history');
            } else {
                console.log('fatal.');
            }
        } else {
            console.log('exit:', currentVideo, nextTitle);
        }
    }

    function loadVideo(videoId) {
        console.log('loadVideo:', videoId)
        if (videoId) { player.loadVideoById(videoId) }
        var feeds = ['feed/inbox.xml', 'feed/shuffle.xml'];
        loadFeed(feeds.shift(), feeds, nextFeed, videoId ? videoId : null, null)
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
            $('#modal .title').html('Hey! Ciao &#x1F44B;');
            $('#modal .message').html($('#welcome').html());
            $('#modal').show();
        }
    }

    function showMore() {
        $('#modal .title').html('Cos\'è techfeed? &#x1F913;');
        $('#modal .message').html($('#show-more').html());
        $('#modal').show();
    }
})($)
