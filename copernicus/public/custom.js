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
        'field': 'title.index',
        'display_asc': 'Title a-z',
        'display_desc': 'Title z-a'
      },
      {
        'field': 'issued.index',
        'display_asc': 'Oldest',
        'display_desc': 'Newest'
    }]
// settings_sort = [{'issued': {'order': 'desc'}}];
settings_default_display = 'card';

var today = getTodayWithTime();
settings_predefined_filters = [
      {'term': {'hasWorkflowState': 'published'}},
      {
          'constant_score': {
              'filter': {
                  'bool': {
                      'should': [
                          {'bool':{'must_not':{'exists': {'field': 'issued'}}}},
                          {'range': {'issued.date': {'lte': today}}}
                      ]
                  }
              }
          }
      }];

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
        predefined_filters: settings_predefined_filters,
        default_sort: [],
        customSetUrl: setUrl,
        selected_sort: "relevance",
        search_sortby: settings_search_sortby,
        // sort: settings_sort,
        post_init_callback: function() {
            // 88482 avoid double add of eea settings and number replacing
            // since we call also post_search_callback
            // add_EEA_settings();
            // replaceNumbers();
            setSimplifiedViewMode();
            moveFooter();
            markNavigationTab(settings_selected_navigation_tab);
            $(window).trigger('post_init_callback');
        },
        post_search_callback: function() {
            add_EEA_settings();
            viewReady();
            replaceNumbers();
            searchModifications();
            checkSimplifiedViewMode();
            overrideNoResultsMessage();

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
    if($.getUrlVars({}).SearchableText !== undefined){
        opts.q = $.getUrlVars({}).SearchableText;
    }
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


function moveFooter() {
    // Move footer
    var footer = $('#content-section');
    $(footer).appendTo(".simplified-template-footer");

    // Modify searchbar text
    $('.facetedview_search input').attr('placeholder', 'Enter your search text here');
}

function searchModifications() {
    // Hide sorting and display options if no results
    var card_results_length = $('.eea-tiles').children().length;
    var tabular_results_length = $('#facetview_results_wrapper tbody tr').length;
    var list_results_length = $('.eea-list-tiles .tileItem').length;
    var results_length = Math.max(card_results_length, tabular_results_length, list_results_length);

    if (results_length > 0) {
        $('.facetview_top').show();
    }
    else {
        $('.facetview_top').hide();
    }

    // Open search filters on page load
    $('.facetview_filter h2').each(function (index, item) {
        if (!$(item).hasClass('facetview_open')) {
            if (item.title === "Published") {
                setTimeout(function(){
                    $(item).trigger('click');
                }, 400);
            }
            else {
                $(item).trigger('click');
            }
        }
    });

    // Show tabular view only when clms products(land items) are selected
    var desired_display = $('.facetview_display_type span.selected');
    var nodes = $(".facetview_tree [rel='objectProvides']");
    var singleselect = false;
    var noselection = true;
    nodes.each(function (index, item) {
        if ($(item).children('a').hasClass('jstree-clicked')) {
            noselection = false;
            if (item.title !== "CLMS products") {
                singleselect = true;
            }
            else {
                $('.eea-icon.tabular').show();
            }
        }
    });
    if (singleselect || noselection) {
        if (nodes.length === 0 && $(desired_display).hasClass('tabular')) {
            $('.eea-icon.tabular').show();
        }
        else {
            $('.eea-icon.tabular').hide();

            if ($(desired_display).hasClass('tabular')) {
                $('.eea-icon.card').click();
            }
        }
    }

    if ($('#facetview_selected_filters .facetview_selection').length === 1) {
        if ($('#facetview_selected_filters .facetview_selection').text().indexOf("CLMS products") !== -1) {
            $('.eea-icon.tabular').show();
        }
        else {
            $('.eea-icon.tabular').hide();
        }
    }
}

function setUrl(stateObj, page, url) {
    url = '@@search' + url;
    return window.history.pushState(stateObj, page, url);
}

function setSimplifiedViewMode() {
  $(".facetview_top").hide();
  $("#facetview_results_wrapper").hide();
  $(".facetview_metadata").hide();
}

function checkSimplifiedViewMode() {
  // Hide display modes if no results
  var no_results = $(".portalMessage.attentionMessage.no-results-message").css("display") == "block";
  if(no_results) {
    $(".facetview_top").hide();
  } else {
    $(".facetview_top").show();
  }

  // Search "Homepage" - show only text input, instead of showing all content
  if (
    ($(".facetview_selection").length == 0) &&
    ($(".facetview_freetext").attr("value").trim().length == 0)
  ) {
    setSimplifiedViewMode();
  } else {
    if(!no_results) {
      $(".facetview_top").show();
    }
    $("#facetview_results_wrapper").show();
    $(".facetview_metadata").show();
  }
}

function overrideNoResultsMessage() {
  $(".portalMessage.attentionMessage.no-results-message").html(
    "Your search gave no results.&nbsp;<strong>Hint:</strong> try to clear search field, enter other search values, adjust or reset your filters."
  );
}
