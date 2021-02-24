//window.search_text_input_clear = true;
jQuery(document).ready(function($) {
  if (window.settings_display_images === undefined){
    settings_display_images = true;
  }
  settings_default_display = 'list';
  var opts = {
    search_url: './tools/api',
    search_index: 'elasticsearch',
    datatype: 'json',
    initial_search: false,
    search_text_input_clear: true,
    enable_rangeselect: true,
    enable_geoselect: true,
    settings_suggestions_enabled: true,
    resultModifier: updateResult,

    display_images: settings_display_images,
    default_sort: [],
    //search_sortby: settings_search_sortby,
    search_sortby: [
      {
        'field': 'label.index',
        'display_asc': 'Title a-z',
        'display_desc': 'Title z-a'
      },
      {
        'field': 'issued',
        'display_asc': 'Oldest',
        'display_desc': 'Newest'
      }
    ],
    sort: [{'issued': {'order': 'desc'}}],
    //sort: settings_sort,
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
      updatePagination();
      limitString();
      setupPage();
      updateTitlesEmptyAcronym();
      $(window).trigger('post_search_callback');
    },
    paging: {
      from: 0,
      size: 10
    },
    display_type_options: settings_display_options,
    display_type: settings_default_display,
    predefined_filters: [{'term': {'hasWorkflowState': 'published'}}]
  };
  function setupPage() {
    //$('.facetview_orderby').before($('.facetview_download'));
    $(".portalMessage.attentionMessage").insertAfter(".facetview_top");
    $('.facetview_download').insertAfter($('.pull-right'));
    $('.facetview_download .eea_download_btn span').html('Download CSV');
  }
  function updateTitlesEmptyAcronym() {
      $('#facetview_results_wrapper a').each(function(){
          title = $(this).text(); // Get current url
          if (title.endsWith(' ()')) {
              $(this).text(title.substr(0, title.length-3));
          }
          if (title.endsWith(' (undefined)')) {
              $(this).text(title.substr(0, title.length-12));
          }
      });
  }
  function updatePagination() {
      $('.facetview_top').css("display", "block");
      $('.top-pagination').css("display", "block");
      //$('.pagination').css("display", "none");
  }
  function limitString() {
    $.each($('.tileItem > .tileBody'), function(index, value) {
      // description = $(value).text();
      // $(value).text(description.slice(0, 400) + '...');
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

  if (window.esbootstrap_options) {
    $.extend(opts, esbootstrap_options);
  }
  if ((eea_mapping.highlights !== undefined) && (eea_mapping.highlights.enabled)){
    opts.highlight_enabled = eea_mapping.highlights.enabled;
    opts.highlight_whitelist = eea_mapping.highlights.whitelist;
    opts.highlight_blacklist = eea_mapping.highlights.blacklist;
  }
  window.settings_suggestions_enabled = true;
  opts.relevance = settings_relevance,
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

    if(result.type === undefined) {
        result.type = '';
    }
    result.types = result.type;
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

function updateResult(element, result){
    result = updateContentTypes(element, result);
    return(result);
}
