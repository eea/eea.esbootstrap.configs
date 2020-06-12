/* Add custom js here */
/* customize esbootstrap options by adding the following global options object
  window.esbootstrap_options = {
        initial_search: false,
        enable_rangeselect: true,
        enable_geoselect: true
    }
 */

// add extra functionalities after the list was displayed or a search was done.
/* $(window).bind('post_init_callback', function(){
        customPostInitFunction();
   });

   $(window).bind('post_search_callback', function(){
        customPostSearchFunction();
  });
*/

var default_sort = [{}, {}];
//default_sort[0][field_base + 'Country'] = {"order": 'asc'};
default_sort[0]['Evaluation ID'] = {"order": 'asc'};

window.esbootstrap_options = {
    default_sort: default_sort
};
