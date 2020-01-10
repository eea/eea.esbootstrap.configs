/* Add custom js here */
/* customize esbootstrap options by adding the following global options object
  window.esbootstrap_options = {
        initial_search: false,
        enable_rangeselect: true,
        enable_geoselect: true
    }
 */

 /* globals $, setTimeout */
$.fn.coFacet = function(settings){

    $.fn.coFacet.loadValuesFromFacet = function(){
        var found = false;

        // move filters to top position
        if ($(".co_facet").children().length === 0) {
            $.each($(".facetview_filter"), function(key, value){
                rel = $(value).children('h2').attr('eea_rel');
                if (["6", "7"].includes(rel)) {
                    $(value).hide();
                    var clone = $(value).clone().show();
                    $(clone).children('h2').click();
                    $(clone).appendTo($('.co_facet'));
                    $(clone).addClass("moved-facet");
                    found = true;
                }
            });
            if (!found){
                setTimeout(loadValuesFromFacet, 100);
            }
            else {
                $('.moved-facet').children('.facetview_filter_options').show();
                $('.moved-facet').children('.facetview_tree').show();
            }
        }
    };
    var loadValuesFromFacet = $.fn.coFacet.loadValuesFromFacet;

    loadValuesFromFacet();
};

// add extra functionalities after the list was displayed or a search was done.
$(window).bind('post_init_callback', function(){
    // customPostInitFunction();
    $( "<div class='co_facet eea-accordion-panels collapsed-by-default non-exclusive'></div>" ).insertAfter($('.content h3')[0]);
    $(".co_facet").coFacet();
});

$(window).bind('post_search_callback', function(){
    // customPostSearchFunction();
    $(".co_facet").coFacet.loadValuesFromFacet();
});
