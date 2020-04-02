// insert the logo also on the navbar for the bootstrap menu
// this ensures that switching from portrait to landscape is without any flash since
// we can show and hide with css
window.jQuery(document).ready(function($){
    var $navbar_header = $(".navbar-header");
    $("#portal-logo-link").clone().attr('id', 'portal-logo-link-header').prependTo($navbar_header);

    $(window).one('results_ready', function() {
        // show and hide remove icon on hovering over added filters
        $("#facetview_selected_filters").on("hover", ".facetview_selection", function(){
            $(this).find('i').toggleClass('hidden');
        }, function(){
            $(this).find('i').toggleClass('hidden');
        });

        $('#facetview_rightcol').on('hover', '.eea-tileBody', function() {
            var $this = $(this);
            var $eea_tile_head = $this.prev();
            var $description = $this.find('.eea-tileDescription');
            if (!$description.html()) {
                return;
            }
            $eea_tile_head.find('.eea-tileThumb').toggleClass('eea-tileHovered');
            $description.stop().animate({
                height: "toggle",
                opacity: 'toggle'
            });
        });
    });

    if ($.fn.Lazy) {
        $(window).on('results_ready', function() {
                $(".lazyLoad").Lazy();
        });
    }

    /*$(".search-app #personaltools-login").on("click", function (ev) {
       ev.preventDefault();
       window.location.href = $("#personaltools-login").attr("href");
    });*/

    /*$(".search-app #personal-menu").on("mouseenter click", function(ev){
          ev.preventDefault();
          $(".login-container").css("display","block");
    }).on("mouseleave", function (ev) {
          ev.preventDefault();
          if( $(ev.target)[0] == $(".login-container")[0] || $(ev.target)[0] == $#login-form .formControls input(".login-text")[0] )  $(".login-container").css("display","none");
    });*/

    $(".mobile-menu .fa").on("click touch", function (ev) {
        if($(ev.target).hasClass("fa-bars")){
            $(".header").addClass("mobile-header");
            $(".top-menu-content").addClass("nav-toggle");
            $(".mobile-menu > i.fa").removeClass("fa-bars").addClass("fa-times");
            $("body").addClass("no-ovf");
            $(".eea-right-section-slider").hide();
        } else {
            $(".eea-right-section-slider").show();
            $(".header").removeClass("mobile-header");
            $(".top-menu-content").removeClass("nav-toggle");
            $("body").removeClass("no-ovf");
            $(".mobile-menu > i.fa").addClass("fa-bars").removeClass("fa-times");
        }

    });

    var url = window.location.pathname;

    var url_href = window.location.href;
    if(url === "/++theme++climateadaptv2/"){
        window.history.replaceState('Climate Adapt Search', 'Climate Adapt Search', url_href.replace("++theme++climateadaptv2", "data-and-downloads"));
    }
    //$(".site-container #portal-columns").remove();
    $("#portal-column-content").hide();
    $("#eea-above-columns").detach().prependTo("portal-column-content");

        //.css("margin-top", "20px");
    $("#portal-columns-app").detach().appendTo("#portal-columns");


    $("#portal-breadcrumbs").hide();

    $("#facetview_selected_filters").on("mouseenter",".facetview_selection", function (ev) {
        $(ev.target).find(".eea-icon-times").removeClass("hidden");
    }).on("mouseleave",".facetview_selection", function (ev) {
        $(ev.target).find(".eea-icon-times").addClass("hidden");
    } );

    $.ajax({
        url: window.location.origin,
        method: "GET",
        xhrFields: {
          withCredentials: true
       },
        success: function ( data,  textStatus, jqXHR) {
            $(".login .personal-menu-action").replaceWith( $(data).find(".login .personal-menu-action") );
            $(".login-container > ul").replaceWith( $(data).find(".login-container > ul") );
        }
    });

    $(window).on('post_search_callback', function () {
        var gTracking = $("#analyticsID").attr("data-tracking");
        if( gTracking !== undefined ){
            if ( $('.facetview_freetext').val().length > 0){
                var d = {
                    "v":"1",
                    "t": "event",
                    // tracking ID
                    "tid": gTracking,
                    // client id
                    "cid": "555",
                    // event category
                    "ec" : "database-search",
                    // event action
                    "ea" : "search",
                    // event value
                    "ev" : 1,
                    //event label
                    "el" : encodeURIComponent( $.trim($('.facetview_freetext').val()))
                };

                $.ajax({
                    method: "POST",
                    url:"https://www.google-analytics.com/collect",
                    data : $.param(d),
                    success: function (data, textStatus, jqXHR) {
                        console.log("sent search word to GA: " + textStatus);
                    },
                    error: function ( jqXHR, textStatus, errorThrown) {
                        console.error(errorThrown);
                    }
                });

                //for production
                /*ga('send', {
                    hitType: 'event',
                    eventCategory: 'database-search',
                    eventAction: 'search',
                    eventLabel: encodeURIComponent($('.facetview_freetext').val()),
                    eventValue: 1
                });*/

            }
        }

    });

    var url = window.location.origin /*+ '/cca/'*/;
    var base_url = $("base").attr('href');
    if (!base_url) {
        return;
    }
    var base_url_length = base_url.length;
    $(".sub-menu-link, .sub-sub-menu-link, .main-nav-item > a").each(function(idx, el) {
        var el_url = el.href;
        var url_length = el_url.length;
        var last_value = el_url.substr(base_url_length, url_length);
        el.href = "/" + url  +last_value;

    });


});

