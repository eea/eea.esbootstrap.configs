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

jQuery(document).ready(function($) {
  var url = $(location).attr('href');

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
      {'constant_score': {
        'filter': {
          'or': [
            {'missing': {'field': 'http://purl.org/dc/terms/issued'}},
            {'range': {'http://purl.org/dc/terms/issued': {'lte': today}}}
          ]
        }}
      }];

  predefined_filters_expired = [
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
  eea_facetview('.facet-view-simple', 
  {
    search_url: './api',
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
    },
    linkify: false,
    paging: {
      from: from_val,
      size: 20
    },
    display_images: false,
    display_type: 'card',
    highlight_enabled: eea_mapping.highlights.enabled,
    highlight_whitelist: eea_mapping.highlights.whitelist,
    highlight_blacklist: eea_mapping.highlights.blacklist,
    enable_exact: true,
    relevance: settings_relevance,
    resultModifier: updateResult
  });
});

