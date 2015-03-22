
var getVideoData = {
    title : null, videoID : null, pubDate : null, fullDate: null, thumbnailImg : null, tinyImg1 : null, tinyImg2 : null,
    tinyImg3 : null, videoLink : null, youtubeLink : null, viewsCount : null, commentsCount : null, channelName : null, htmlString : null,
    /*
    * Init
    *
    * This is not doing much, right now its just serving as an initialization point on document ready
    * it also does some page navigation shit, which is really hacky for now, we'll fix all that later... 
    */
    init: function() {
        $(document).ready(function() {
            $(".page2").hide();
            getVideoData.handleData();
        })
        $("#team1").on("click", function() {
            $(".page2").show();
            $(".teams").hide();
            //getVideoData.handleData();
        })

    },
    /*
    * HandleData
    *
    * So this uses ajax to establish a connection between premHub and youtube's API
    * It then parses all the JSON objects retrieved to get all the relevant stuff
    */
    handleData : function() {
        $("#queryOptions ul li a").on("click", function(e) {
            e.preventDefault();
            getVideoData.htmlString  = '<ul id="videoslisting">';
            getVideoData.channelName = $(this).attr('href').substring(1);
            console.log(getVideoData.channelName);

            $.ajax({
                url : "http://gdata.youtube.com/feeds/api/users/"+ getVideoData.channelName +"/uploads?alt=json&max-results=10",
                data: ({
                }),
                dataType : "json"
            })
                .success(function(data){
                    $.each(data.feed.entry, function(i, item) {
                        getVideoData.title    = item['title']['$t'];
                        getVideoData.videoID  = item['id']['$t'];

                        getVideoData.pubDate  = item['published']['$t'];
                        getVideoData.fullDate = new Date(getVideoData.pubDate).toLocaleDateString();

                        getVideoData.thumbnailImg = item['media$group']['media$thumbnail'][0]['url'];
                        getVideoData.tinyImg1 = item['media$group']['media$thumbnail'][1]['url'];
                        getVideoData.tinyImg2 = item['media$group']['media$thumbnail'][2]['url'];
                        getVideoData.tinyImg3 = item['media$group']['media$thumbnail'][3]['url'];

                        getVideoData.videoLink    = item['media$group']['media$content'][0]['url'];
                        getVideoData.youtubeLink   = item['media$group']['media$player'][0]['url'];
                        getVideoData.viewsCount = item['yt$statistics']['viewCount'];
                        getVideoData.commentCount = item['gd$comments']['gd$feedLink']['countHint'];

                        console.log(getVideoData.title);
                        console.log(getVideoData.videoID);
                        console.log(getVideoData.pubDate);
                        console.log(getVideoData.fullDate);
                        console.log(getVideoData.thumbnailImg);
                        console.log(getVideoData.tinyImg1);
                        console.log(getVideoData.tinyImg2);
                        console.log(getVideoData.tinyImg3);
                        console.log(getVideoData.videoLink);
                        console.log(getVideoData.youtubeLink);
                        console.log(getVideoData.viewsCount);
                        console.log(getVideoData.commentCount);

                        /* This shit is pretty nasty, i'll clean it up later. But it sha works for now ... because were testing */
                        getVideoData.htmlString +='<li class="clearfix"><h2>' + getVideoData.title + '</h2>';
                        getVideoData.htmlString +='<div class="videothumb"><a href="' + getVideoData.youtubeLink + '" target="_blank"><img src="' + getVideoData.thumbnailImg + '" width="480" height="360"></a></div>';
                        getVideoData.htmlString +='<div class="meta"><p>Published on <strong>' + getVideoData.fullDate + '</strong></p><p>Total views: <strong>' +
                                                    getVideoData.commafy(getVideoData.viewsCount) + '</strong></p><p>Total comments: <strong>'+ getVideoData.commentCount +'</strong></p><p><a href="'+
                                                    getVideoData.youtubeLink +'" class="external" target="_blank">View on YouTube</a></p><p><a href="'+ getVideoData.youtubeLink +
                                                    '" class="external" target="_blank">View in Fullscreen</a></p><p><strong>Alternate Thumbnails</strong>:<br><img src="'+
                                                    getVideoData.tinyImg1 +'"> <img src="' + getVideoData.tinyImg2 + '"> <img src="'+ getVideoData.tinyImg3 +'"></p></div></li>';

                    });

                    $('#videos').html(getVideoData.htmlString + "</ul>");

                })
                .error(function(data){
                    console.log(data);
                })
        })
    },
    /*
    * Commafy
    *
    * This was the only thing that was really fucked up to do. That's cause i dont know how regular expressions work (reGex)
    *
    * Got this as a solution to the problem of Adding commas or spaces to group every three digits, when 
    * processing the number of views on a youtube video.
    * 
    * The original answer is available on this link: http://stackoverflow.com/a/6785438
    */
    commafy : function(arg) {
        arg += '';
        var num = arg.split('.');
        if (typeof num[0] !== 'undefined'){
            var int = num[0];
            if (int.length > 3){
                int     = int.split('').reverse().join('');
                int     = int.replace(/(\d{3})/g, "$1,");
                int     = int.split('').reverse().join('')
            }
        }
        if (typeof num[1] !== 'undefined'){
            var dec = num[1];
            if (dec.length > 4){
                dec     = dec.replace(/(\d{3})/g, "$1 ");
            }
        }

        return (typeof num[0] !== 'undefined'?int:'')
        + (typeof num[1] !== 'undefined'?'.'+dec:'');
    }
}
getVideoData.init();