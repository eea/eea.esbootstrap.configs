/* global $, jQuery, window, location, eea_mapping, simple_value, simpleValue,
   document, get_image, settings_default_external_configs, settings_external_configs,
    getToday, eea_facetview */
var blackList = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' : []};

var whiteList = false;

var predefined_filters = [];
var predefined_filters_expired = [];

function add_titles(){
    var records = $('.facet-view-simple').facetview.options.data.records;
    var display_type = $('.facet-view-simple').facetview.options.display_type;
    if (display_type !== 'tabular'){
        return;
    }
    for (var i = 0; i < records.length; i++){
        var id = records[i]['http://www.w3.org/1999/02/22-rdf-syntax-ns#about'];
        var element = $("a[href='"+id+"']");
        var title = element.text();
        element.attr("title", title);
    }
}

function add_ribbon(id, message, ribbon_class){
   var display_type = $('.facet-view-simple').facetview.options.display_type;
    var ribbon = $('<div class="ribbon-wrapper"><div class="ribbon">' + message + '</div></div>');
    if (display_type === 'tabular'){
        $("a[href='"+id+"']").closest("td").addClass(ribbon_class);
        $("a[href='"+id+"']").closest("td").addClass("ribbon-parent");
        ribbon
            .insertBefore("a[href='"+id+"']");
    }
    if (display_type === 'card'){
        $("a[href='"+id+"']").addClass(ribbon_class);
        $("a[href='"+id+"']").addClass("ribbon-parent");
        ribbon
            .appendTo("a[href='"+id+"']");
    }
    if (display_type === 'list'){
        $("a[href='"+id+"']").closest(".tileItem").addClass(ribbon_class);
        $("a[href='"+id+"']").closest(".tileItem").addClass("ribbon-parent");
        ribbon
            .insertBefore("a[href='"+id+"']");
    }
}

function mark_recent(){
    var records = $('.facet-view-simple').facetview.options.data.records;
    for (var i = 0; i < records.length; i++){
        if ((records[i]['http://purl.org/dc/terms/issued'] !== undefined) && (records[i]['http://purl.org/dc/terms/issued'] !== '')){
            var issued_date_stamp = Date.parse(records[i]['http://purl.org/dc/terms/issued']);
            var now_stamp = Date.now();
            var days = (now_stamp - issued_date_stamp)/1000/60/60/24;
            if (days < 30){
                var id = records[i]['http://www.w3.org/1999/02/22-rdf-syntax-ns#about'];
                add_ribbon(id, "NEW", "recent");
            }
        }
    }
}

function mark_expired(){
    var records = $('.facet-view-simple').facetview.options.data.records;
    for (var i = 0; i < records.length; i++){
        if ((records[i]['http://purl.org/dc/terms/expires'] !== undefined) && (records[i]['http://purl.org/dc/terms/expires'] !== '')){
            var expire_date_stamp = Date.parse(records[i]['http://purl.org/dc/terms/expires']);
            var now_stamp = Date.now();
            if (now_stamp >= expire_date_stamp){
                var id = records[i]['http://www.w3.org/1999/02/22-rdf-syntax-ns#about'];
                add_ribbon(id, "ARCHIVED", "expired");
            }
        }
    }
}

function add_control_for_expired(){
  $(".facetview_include_expired").remove();
  var checkbox = $('<div class="facetview_include_expired filter-by"><span>Include archived content </span><input type="checkbox" id="include_expired" value=""></div>');
  checkbox.insertAfter(".facetview_display_type");
  var original_predefined_filters = $('.facet-view-simple').facetview.options.predefined_filters;
  if (original_predefined_filters.length === 2){
    $("#include_expired").prop("checked", true);
  }
  $("#include_expired").change(function() {
    var tmp_predefined_filters = [];
    tmp_predefined_filters = tmp_predefined_filters.concat(predefined_filters);
    if(! this.checked){
        tmp_predefined_filters = tmp_predefined_filters.concat(predefined_filters_expired);
    }
    $('.facet-view-simple').facetview.options.predefined_filters = tmp_predefined_filters;
    $('.facet-view-simple').facetview.dosearch();
  });
}

function hide_unused_options(blackList, whiteList) {
  var filters = $('a.facetview_filterchoice');
  for (var filter in filters) {
    var thisFilter = filters[filter];
    var value;
    if (thisFilter.href) {
      value = thisFilter.href.substring(
        thisFilter.href.lastIndexOf('/') + 1,
        thisFilter.href.length);
    }
    if (!whiteList.isEmptyObject) {
      var toKeep = whiteList[thisFilter.rel];
      if (toKeep && toKeep.indexOf(value) === -1) {
        hidden = $(thisFilter.parentNode).remove();
      }

    } else {
      var toHide = blackList[thisFilter.rel];
      if (toHide === undefined) {
        continue;
      }
      if (toHide.indexOf(value) >= 0) {
        $(thisFilter.parentNode).remove();
      }
    }
  }
}

function add_iframe() {
  if (window.embed) {
    var url = $(location).attr('href');
    var position = url.indexOf('?');
    url = url.substring(0, position);
    var width = $('.facet-embed')[0].offsetWidth;
    var height = $('.content').height();

    var button = '<button class="btn btn-small btn-lg" data-toggle="modal"' +
        'data-target="#myModal">' + 'Embed' + ' </button>';
    var popup = [
      '<div class="modal fade" id="myModal" tabindex="-1"',
      'role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
      '<div class="modal-dialog">',
      '<div class="modal-content">',
      '<div class="modal-header">',
      '<button type="button" class="close"',
      'data-dismiss="modal" aria-hidden="true">&times;</button> ',
      '<h4 class="modal-title" id="myModalLabel">Embed code</h4>',
      '<div class="modal-body"> <textarea style="width:95%" rows="3">',
      '<iframe width="',
      width,
      '" height="',
      height,
      '" src="',
      url,
      '"></iframe></textarea></div></div></div></div></div>'
    ].join('');

    $('.facet-embed').append(button + popup);

  }
}

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

function updateWithHTTPS(result){
    result.url = result.url.split("http://").join("https://");
    result.thumbUrl = result.thumbUrl.split("http://").join("https://");
    result.typeIcon = result.typeIcon.split("http://").join("https://");
    return result;
}

function updateResult(element, result){
    result = updateContentTypes(element, result);
    result = updateWithHTTPS(result);
    result = updateFileURLs(element, result);
    return(result);
}

function getSpatialFromUrl(){
    var url = $(location).attr('href');
    var short_spatial = url.split("/")[url.split("/").length - 1].split("?")[0];
    var spatial;
    var spatial_field = "http://purl.org/dc/terms/spatial";
    if (settings_default_external_configs[short_spatial] !== undefined){
        spatial = settings_default_external_configs[short_spatial].value;
        if (typeof spatial === "string"){
            spatial = [spatial];
        }
        if (settings_default_external_configs[short_spatial].type === 'region') {
            spatial_field = "places";
        }
    }
    return {
        "spatial_field": spatial_field,
        "spatial_values": spatial
    };
}

function getUrl(options){
    var today = getToday();
    var query =
        {"query":
            {"function_score":
                {"query":
                    {"bool":
                        {"must":
                            [
                                {"term":{"http://www.eea.europa.eu/ontologies.rdf#hasWorkflowState":"published"}},
                                {"term":{"language":"en"}},
                                {"constant_score":
                                    {"filter":
                                        {"or":
                                            [
                                                {"missing":{"field":"http://purl.org/dc/terms/issued"}},
                                                {"range":{"http://purl.org/dc/terms/issued":{"lte":today}}}
                                            ]
                                        }
                                    }
                                },
                                {'constant_score':{
                                    'filter':{
                                        "and":
                                            [
                                                {"not":
                                                    {"term": {
                                                            "cluster_id": "eea_organisations"
                                                        }
                                                    }
                                                }
/*                                                ,
                                                {"not":
                                                    {"term":
                                                        {"cluster_id": "rod_clients"}
                                                    }
                                                }*/
                                                // example how to exclude other documents
                                            ]
                                        }
                                    }
                                },
                                {"constant_score":
                                    {"filter":
                                        {"or":
                                            [
                                                {"missing":{"field":"http://purl.org/dc/terms/expires"}},
                                                {"range":{"http://purl.org/dc/terms/expires":{"gte":today}}}
                                            ]
                                        }
                                    }
                                },
/*                                {"range":{"items_count_http://purl.org/dc/terms/spatial":{"from":1,"to":1}}},*/ 
                            ],
                        }
                    },
                "filter":
                    {"and":
                        [
                            {"bool":
                                {"should":
                                    [
/*                                        {"term":{"http://purl.org/dc/terms/spatial":"Albania"}}*/
                                    ]
                                }
                            }
/*                            ,
                            {"bool":
                                {"should":
                                    [
                                        {"term":{"http://www.eea.europa.eu/portal_types#topic":"Policy instruments"}},
                                        {"term":{"http://www.eea.europa.eu/portal_types#topic":"Resource efficiency and waste"}}
                                    ]
                                }
                            }*/
                        ]
                    }
                }
            },
            "display_type":"card",
            "size":1000,
            "sort":[{"http://purl.org/dc/terms/issued":{"order":"desc"}}],"highlight":{"fields":{"*":{}}}
        };

    var spatial_info = getSpatialFromUrl();
    var exact_spatial = {
        "range":{}
    };
    exact_spatial.range["items_count_" + spatial_info.spatial_field] = {"from":1, "to": 1};

    query.query.function_score.query.bool.must.push(exact_spatial);

    var href = window.location.href;
    var href_parts = href.split("?topic=");
    for (var i = 0; i < spatial_info.spatial_values.length; i++){
        var term_spatial = {
            "term":{}
        };
        term_spatial.term[spatial_info.spatial_field] = spatial_info.spatial_values[i];
        query.query.function_score.filter.and[0].bool.should.push(term_spatial);
    }
    if (href_parts.length > 1){
        var topics = decodeURIComponent(href_parts[1]).split(",");
        for (var i = 0; i < topics.length; i++){
            if (query.query.function_score.filter.and[1] === undefined){
                query.query.function_score.filter.and.push({'bool':{"should":[]}});
            }
            var term_topic = {"term":{"http://www.eea.europa.eu/portal_types#topic":topics[i]}};
            query.query.function_score.filter.and[1].bool.should.push(term_topic);
        }
    }
    var query_str = encodeURIComponent(JSON.stringify(query));
    var url_base = window.location.href.split("?")[0];
    href = url_base + "?source=" + query_str;
    return href;
}

function setUrl(stateObj, page, url){
    var query = JSON.parse(decodeURIComponent(url).split("source=")[1]);
    var topics_str = "";
    try {
        var topics = query.query.function_score.filter.and[1].bool.should;
        if (topics.length === 0){
            throw "empty";
        }
        topics_str = "?topic=";
        for (var i = 0; i < topics.length; i++){
            topics_str += topics[i].term["http://www.eea.europa.eu/portal_types#topic"] + ",";
        }
        topics_str = topics_str.substring(0, topics_str.length - 1);
    }
    catch(err){
        var href_url = $(location).attr('href');
        topics_str = href_url.split("/")[href_url.split("/").length - 1].split("?")[0];
    }

    if ($('.facet-view-simple').facetview.options.last_topics_str !== topics_str){
        $('.facet-view-simple').facetview.options.last_topics_str = topics_str;
        window.history.pushState(stateObj, page, topics_str);
    }
}

function update_results_count(){
    $("<span class='car-pagination'><strong class='car_results_count'></strong> results</span>").appendTo(".top-pagination");
    $(".car_results_count").text($(".eea_results_count").text());
}

jQuery(document).ready(function($) {
  $.extend(true, settings_default_external_configs, settings_external_configs);
  var url = $(location).attr('href');

  var spatial_info = getSpatialFromUrl();
  var spatial = spatial_info.spatial_value;
  var spatial_field = spatial_info.spatial_field;

  var hide_expired = true;
  if (url.split("?source=").length === 2){
    var source_str = url.split("?source=")[1];
    source_str = decodeURIComponent(source_str);
    var source_query = JSON.parse(source_str);
    if ((source_str.indexOf('{"missing":{"field":"http://purl.org/dc/terms/expires"}}')) === -1){
        hide_expired = false;
    }
  }
  var vfrom = url.indexOf('from');
  var from_val = vfrom !== -1 ? window.parseInt(url.substring(vfrom + 10, vfrom + 12)) : 0;


  var today = getToday();

  predefined_filters = [
      {'term': {'http://www.eea.europa.eu/ontologies.rdf#hasWorkflowState':
                  'published'}},
      {'term': {'language':
                  'en'}},
      {'constant_score': {
        'filter': {
          'or': [
            {'missing': {'field': 'http://purl.org/dc/terms/issued'}},
            {'range': {'http://purl.org/dc/terms/issued': {'lte': today}}}
          ]
        }}
      },
      {'constant_score':{
        'filter':{
            "and":
                [
                    {"not":
                        {"term":
                            {"cluster_id": "eea_organisations"}
                        }
                    }
/*                    ,
                    {"not":
                        {"term":
                            {"cluster_id": "rod_clients"}
                        }
                    }*/
                    // example how to exclude other documents
                ]
            }
        }
      }
      ];

  predefined_filters_expired = [
      {'term': {'language':
                  'en'}},
      {'constant_score': {
        'filter': {
          'or': [
            {'missing': {'field': 'http://purl.org/dc/terms/expires'}},
            {'range': {'http://purl.org/dc/terms/expires': {'gte': today}}}
          ]
        }}
      }
    ];


  var tmp_predefined_filters = [];
  tmp_predefined_filters = tmp_predefined_filters.concat(predefined_filters);
  if (hide_expired){
    tmp_predefined_filters = tmp_predefined_filters.concat(predefined_filters_expired);
  }

  var tmp_spatial_range = {"range":{}};
  tmp_spatial_range.range["items_count_" + spatial_field] = {"from": 1, "to": 1};

  tmp_predefined_filters.push(tmp_spatial_range);

  eea_facetview('.facet-view-simple', 
  {
    search_url: './tools/api',
    datatype: 'json',
    search_index: 'elasticsearch',
    search_sortby: [
      {
        'field': 'http://purl.org/dc/terms/title',
        'display_asc': 'Title a-z',
        'display_desc': 'Title z-a'
      },
      {
        'field': 'http://purl.org/dc/terms/issued',
        'display_asc': 'Oldest',
        'display_desc': 'Newest'
      }
    ],
    sort: [{'http://purl.org/dc/terms/issued': {'order': 'desc'}}],
//    selected_sort: "relevance",
    default_operator: 'AND',
    default_freetext_fuzzify: '',
    querystr_filtered_chars: ':?',
    no_results_message: 'Your search did not return any results',
    add_undefined: true,
    predefined_filters: tmp_predefined_filters,
    pager_on_top: true,
    permanent_filters: true,
    post_init_callback: function() {
      add_EEA_settings();
      markNavigationTab(settings_selected_navigation_tab);
      replaceNumbers();
    },
    post_search_callback: function() {
      add_control_for_expired();
      hide_unused_options(blackList, whiteList);
      add_EEA_settings();
      viewReady();
      replaceNumbers();
      add_iframe();
      add_titles();
      mark_expired();
      mark_recent();
      update_results_count();
      $("#car_facet").carFacet.loadValuesFromFacet();
    },
    linkify: false,
    paging: {
      from: from_val,
      size: 1000
    },
    display_images: false,
    display_type: 'card',
    highlight_enabled: eea_mapping.highlights.enabled,
    highlight_whitelist: eea_mapping.highlights.whitelist,
    highlight_blacklist: eea_mapping.highlights.blacklist,
    enable_exact: true,
    relevance: settings_relevance,
    resultModifier: updateResult,
    customSetUrl: setUrl,
    customGetUrl: getUrl,
    hideCurrentFilters: true
  });
  $("#car_facet").carFacet();

});

jQuery(function($) {
    $(".navbar-toggle").click(function(ev) { 
        $(ev.target).toggleClass('collapsed');
        $(".navbar-collapse").toggleClass('in');
    });
});
