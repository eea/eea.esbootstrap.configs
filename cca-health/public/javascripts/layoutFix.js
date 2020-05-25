// Beacause we use a single external template (with header and footer in the same template)
// we need this function to insert the search app content into our template
jQuery(document).ready(function($) {
  $('#portal-columns').replaceWith($('#portal-columns-app'));
  $('h2#typeOfData').click();
});
