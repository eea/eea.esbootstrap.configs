// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {
  $(".health-left").remove();
  $('#content').empty().append($('#portal-columns-app'));
  $('h2#typeOfData').click();
  // $("img.lazyLoad").Lazy();

  // $(window).on('results_ready', function() {
  //   console.log('results ready');
  //     $(".lazyLoad").Lazy();
  //     $(".lazyload").Lazy();
  //   if ($.fn.Lazy) {
  //     $(".lazyLoad").Lazy();
  //     $(".lazyload").Lazy();
  //   }
  // });
});
