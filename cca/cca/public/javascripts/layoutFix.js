// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {
//  $('#portal-columns-app').appendTo('#portal-column-content');
    $('#portal-columns').replaceWith($('#portal-columns-app'));
    if (window.location.search.includes('typeOfData') && !$('h2#typeOfData').hasClass('facetview_open')) {
        $('h2#typeOfData').click();
    }
    $('.current-filters-collapsible').click();
    $('.eea-reset-filters').insertAfter($('.top-pagination'));

    $(window).on('facet_ready', function() {
      $.fn.i18nRender(langObj, langObj['lang']);
    });

});
