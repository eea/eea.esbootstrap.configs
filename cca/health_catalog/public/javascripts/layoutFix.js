// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {

    setResultsPaging(checkIfTabular());
    $(document).on("mousedown", "#filterDisplayAs span.eea-icon", function(event) {
        $.fn.facetview.options.paging.size=16;
        if ($(this).attr('class').indexOf('tabular')>0) {
            $.fn.facetview.options.paging.size=1000;
        }
        setResultsPaging($(this).attr('class').indexOf('tabular')>0?true:false);
        //$.fn.facetview.options.paging.size=1000
    });

    function checkIfTabular() {
        var params = new URLSearchParams(window.location.search);
        if (!params.has('source')) {
            return false;
        }
        var decodedData = decodeURIComponent(params.get('source'));
        var jsonObject = JSON.parse(decodedData);
        return jsonObject.display_type == 'tabular';
    }

    function setResultsPaging(showChart = false) {
        $.fn.facetview.options.paging.size=12;
        if (showChart>0) {
            $.fn.facetview.options.paging.size=1000;
        }
        console.log('Will display:'+$.fn.facetview.options.paging.size);
    }
    // adjust layout according to "CCA Observatory standard". See
    // https://taskman.eionet.europa.eu/attachments/download/86199/PILOT%20Health%20and%20Climate%20Adaptation%20Observatory_MockUpv4%20cleaned.pdf

    var checkExist = setInterval(function() {
        if ($('#content').length) {
            // debugger;
            $('#content').empty().append($('#portal-columns-app'));
            clearInterval(checkExist);
        }
    }, 100);

    // /*
    $('#facetview_rightcol').prepend("<div class='row'>"
                                        +"<div class='column col-md-10' id='filterInput'></div>"
                                        +"<div class='column text-right' id='filterDisplayAs'></div>"
                                        +"<div class='column text-right' id='filterSort'></div>"
                                    +"</div>"
                                );

    $('#portal-columns-app').prepend("<div class='column col-md-12' id='filterTitle'><h2>Observatory resource catalogue</h2></div>");

    $( "#facetview_rightcol" ).after("<div id='facetview_article' class='hide row-fluid'><div id='facetview_article_content'></div></div>");
    $('#filterInput').prepend($('.facetedview_search'));
    $('#filterDisplayAs').prepend($('.facetview_display_type'));
    $('#filterSort').prepend($('.facetview_orderby'));
    $('.facetview_top').hide();
//*/
    $('#filterTitle').insertAfter('.header');
    $('#filterSort').insertAfter('.top-pagination');
    $('#filterDisplayAs').insertAfter('.top-pagination');

    $('[i18n-variable=App_Search_Placeholder]').text("What are you looking for?");
    $('[i18n-variable=App_Search_Placeholder]')[0].placeholder = "What are you looking for?";
    $('[i18n-variable=Search_Display_As_Span_Text]').text("Display the results as");

    var margin = $('.main-area').css('margin-left');
    $('#filterTitle').css('padding-left', margin);
    $('#filterTitle').css('padding-right', margin);

    $('#facetview_results_wrapper .eea-tileInner').on('click', function() {
        return false;
    });
  $(window).on('post_search_callback', function() {
    // debugger;
    // $('#content').prepend($('#filterTitle'));
    // $('.filters-header').remove()

    $(".health-left").remove();
    if (!$('h2#typeOfData').hasClass('facetview_open')) {
        $('h2#typeOfData').click();
    }
    // $("img.lazyLoad").Lazy();
    console.log('results ready');
    $(".lazyload").Lazy();
    if ($.fn.Lazy) {
      $(".lazyload").Lazy();
    }
  });
});
