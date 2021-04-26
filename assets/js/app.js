(function($){

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady

    loadScripts()

    function loadScripts() {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }


    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: 'YF08uKbBUFo',
            /*playerVars: {
                autoplay: 1
            },*/
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });

    }

// 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        player.loadVideoByUrl("https://youtu.be/bHQqvYy5KYo");
        player.playVideo();
        //inbox()
        //event.target.playVideo();
    }

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }
    function stopVideo() {
        player.stopVideo();
    }


    function inbox() {
        $.get('feed/inbox.xml', function(xml){
            $(xml).find('item').each(function() {
                var title = $('title', this).text()
                var link = $('link', this).text()
                console.log(link)

                //player.loadVideoByUrl(link);
            })
        })
    }
})($);