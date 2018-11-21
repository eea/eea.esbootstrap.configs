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
settings_display_options = ['card', 'tabular', 'list'];
settings_search_sortby = [
      {
        'field': 'title',
        'display_asc': 'Title a-z',
        'display_desc': 'Title z-a'
      },
      {
        'field': 'issued',
        'display_asc': 'Oldest',
        'display_desc': 'Newest'
    }]
// settings_sort = [{'issued': {'order': 'desc'}}];
settings_default_display = 'card';

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
        selected_sort: "relevance",
        search_sortby: settings_search_sortby,
        // sort: settings_sort,
        post_init_callback: function() {
            // 88482 avoid double add of eea settings and number replacing
            // since we call also post_search_callback
            // add_EEA_settings();
            // replaceNumbers();
            markNavigationTab(settings_selected_navigation_tab);
            $(window).trigger('post_init_callback');
        },
        post_search_callback: function() {
            add_EEA_settings();
            viewReady();
            replaceNumbers();
            $(window).trigger('post_search_callback');
        },
        paging: {
            from: 0,
            size: 30
        },
        display_type_options: settings_display_options,
        display_type: settings_default_display,
        resultModifier: updateResult
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


function updateContentTypes(element, result){
    result.contentType = 'generic';
    var contentTypes = {};

    if (eea_mapping.types !== undefined){
        if (eea_mapping.types.defaultContentType !== undefined){
            result.contentType = eea_mapping.types.defaultContentType;
        }
        if (eea_mapping.types.contentTypeNormalize !== undefined){
            contentTypes = eea_mapping.types.contentTypeNormalize;
        }
    }

    result.type = '';
    result.typeClass = '';
    if (!$.isArray(result.types)){
        result.types = [result.types];
    }

    if (result.types.length>0) {
        var pos = result.types.length - 1;
        while(true){
            result.type = result.types[pos];
            result.typeClass = result.type.toLowerCase().replace(/\s/g, '-');
            if (contentTypes[result.typeClass]){
                result.contentType = contentTypes[result.typeClass];
                break;
            }
            pos--;
            if (pos < 0){
                break;
            }
        }
    }
    if ((eea_mapping.types !== undefined) && (eea_mapping.types.images !== undefined) && (eea_mapping.types.images.rules !== undefined)){
        if (eea_mapping.types.images.fallback_thumb !== undefined){
            result.thumbUrl = eea_mapping.types.images.fallback_thumb;
        }
        if (eea_mapping.types.images.fallback_icon !== undefined){
            result.typeIcon = eea_mapping.types.images.fallback_icon;
        }
        var found_rule_for_resource = false;
        for (var rule_count = 0; rule_count < eea_mapping.types.images.rules.length; rule_count++){
            if (!found_rule_for_resource){
                var rule = eea_mapping.types.images.rules[rule_count];
                var field_for_rule = simpleValue(element[rule.field]);
                if (field_for_rule === undefined){
                    field_for_rule = "";
                }
                var compare_result = false;
                if (rule.rule === 'startsWith'){
                    compare_result = (field_for_rule.startsWith(rule.value));
                }
                if (rule.rule === 'contains'){
                    if (field_for_rule.indexOf(rule.value) !== -1){
                        compare_result = true;
                    }
                }
                if (rule.operator === 'not'){
                    compare_result = !compare_result;
                }
                found_rule_for_resource = compare_result;
                if (found_rule_for_resource){
                    result.thumbUrl = get_image("thumb_template", element, result, rule);
                    result.typeIcon = get_image("icon_template", element, result, rule);
                }
            }
        }
    }
    return(result);
}


function updateFileURLs(element, result){
    var types = ["File"]; // the label of the topic, ex: "File", "Graph (image)" etc.
    if ($.inArray(result.type, types) !== -1){
        result.url = result.url + "/view";
    }
    return result;
}


function updateResult(element, result){
    result = updateContentTypes(element, result);
    result = updateFileURLs(element, result);
    return(result);
}
