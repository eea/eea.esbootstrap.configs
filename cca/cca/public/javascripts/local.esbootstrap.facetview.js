jQuery(document).ready(function($) {
    if (window.settings_display_images === undefined){
        settings_display_images = true;
    }
    var opts = {
        search_url: './tools/api',
        search_index: 'elasticsearch',
        datatype: 'json',
        initial_search: false,
        enable_rangeselect: true,
        enable_geoselect: true,
        display_images: settings_display_images,
        default_sort: [],
        search_sortby: settings_search_sortby,
        sort: settings_sort,
        post_init_callback: function() {
            // 88482 avoid double add of eea settings and number replacing
            // since we call also post_search_callback
            // add_EEA_settings();
            // replaceNumbers();
            markNavigationTab(settings_selected_navigation_tab);
            $(window).trigger('post_init_callback');
        },
        post_search_callback: function() {

            limitString();
            $(window).trigger('post_search_callback');
        },
        paging: {
            from: 0,
            size: 10
        },
        display_type_options: settings_display_options,
        display_type: settings_default_display
    };
    if (window.esbootstrap_options) {
       $.extend(opts, esbootstrap_options);
    }
    if ((eea_mapping.highlights !== undefined) && (eea_mapping.highlights.enabled)){
        opts.highlight_enabled = eea_mapping.highlights.enabled;
        opts.highlight_whitelist = eea_mapping.highlights.whitelist;
        opts.highlight_blacklist = eea_mapping.highlights.blacklist;
    }
    eea_facetview('.facet-view-simple', opts);
});


function limitString() {
console.log('limit string');
    $.each($('.tileItem > .tileBody'), function(index, value) {
      // description = $(value).text();
      // $(value).text(description.slice(0, 700) + '...');
    description = value.innerHTML;
    if (description.length > 700) {
      var new_description = description.slice(0, 700);
      var slice_index = 700;
      is_html = /<\/?[a-z][\s\S]*>/i.test(description.slice(slice_index - 5, slice_index + 5));
      while(is_html) {
          slice_index += 5;
          is_html = /<\/?[a-z][\s\S]*>/i.test(description.slice(slice_index - 5, slice_index + 5));
          new_description = description.slice(0, slice_index);
          if (slice_index >= 900) {
            new_description = description;
            break;
          }
      }
      value.innerHTML = new_description + '...';
    }
    });
}
