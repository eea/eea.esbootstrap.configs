// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {

    setResultsPaging($('#filterDisplayAs span.eea-icon.tabular.selected').length?true:false);
    $(document).on("mousedown", "#filterDisplayAs span.eea-icon", function(event) {
        $.fn.facetview.options.paging.size=12;
        if ($(this).attr('class').indexOf('tabular')>0) {
            $.fn.facetview.options.paging.size=1000;
        }
        setResultsPaging($(this).attr('class').indexOf('tabular')>0?true:false);
        //$.fn.facetview.options.paging.size=1000
    });
    function setResultsPaging(showChart = false) {
        $.fn.facetview.options.paging.size=12;
        if (showChart>0) {
            $.fn.facetview.options.paging.size=1000;
        }
    }
  // adjust layout according to "CCA Observatory standard". See
  // https://taskman.eionet.europa.eu/attachments/download/86199/PILOT%20Health%20and%20Climate%20Adaptation%20Observatory_MockUpv4%20cleaned.pdf
  $('#content').empty().append($('#portal-columns-app'));

  // /*
  $('#facetview_rightcol').prepend("<div class='row'>"
                                        +"<div class='column col-md-8' id='filterTitle'><h2>OBSERVATORY RESOURCE CATALOG search tool</h2></div>"
                                        +"<div class='column col-md-4 text-right' id='filterDisplayAs'></div>"
                                    +"</div>"
                                    +"<div class='row'>"
                                        +"<div class='column col-md-8' id='filterInput'></div>"
                                        +"<div class='column col-md-4 text-right' id='filterSort'></div>"
                                    +"</div>"
                                );

    $( "#facetview_rightcol" ).after("<div id='facetview_article' class='hide row-fluid'><div style='width:100%' class='text-right'><a href='' style='color:white' class='button-field standard-button primary-button' id='faceview_article_back_to_list'>back to search results</a></div><div id='facetview_article_content'></div></div>");
    $('#filterInput').prepend($('.facetedview_search'));
    $('#filterDisplayAs').prepend($('.facetview_display_type'));
    $('#filterSort').prepend($('.facetview_orderby'));
    $('.facetview_top').hide();
//*/
    $('#facetview_results_wrapper .eea-tileInner').on('click', function() {
        return false;
    });
  $(window).on('post_search_callback', function() {
    $(".health-left").remove();
    $('h2#typeOfData').click();
    // $("img.lazyLoad").Lazy();
    console.log('results ready');
    $(".lazyload").Lazy();
    if ($.fn.Lazy) {
      $(".lazyload").Lazy();
    }
  });
});
