// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {

  // adjust layout according to "CCA Observatory standard". See
  // https://taskman.eionet.europa.eu/attachments/download/86199/PILOT%20Health%20and%20Climate%20Adaptation%20Observatory_MockUpv4%20cleaned.pdf
  $('#content').empty().append($('#portal-columns-app'));

  $('.right-column-area').prepend($('.facetedview_search'));

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
