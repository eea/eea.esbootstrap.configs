var today = getTodayWithTime();

focusArticlePath = checkDefaultArticle();

function updateLanguageLinks() {
  $('ul#portal-languageselector a[target="_blank"]').removeAttr('target');

  pathname = window.location.pathname.substring(3)
  //search = window.location.search
  params = new URLSearchParams(location.search);
  search = 'source='+encodeURIComponent(params.get('source'))

  as = document.querySelectorAll("ul#portal-languageselector > li a");
  for (i=0;i<as.length;i++) {
    language = as[i].href;
    language = language.substring(language.length-2)
    as[i].href= '/' + language + pathname + '?'+ search + '&lang=' + language;
  }
}

window.esbootstrap_options = {
  search_sortby: [
    {
      'field': 'title.index',
      'display_asc': 'Title a-z',
      'display_desc': 'Title z-a'
    },
    {
      'field': 'issued',
      'display_asc': 'Oldest',
      'display_desc': 'Newest'
    }
  ],
  paging: {
    from: 0,
    size: 12
  },
  display_type: 'list',   // list
  resultModifier: updateResult,
  settings_suggestions_enabled: true,
  initialsearch: true,
  //predefined_filters: [{'term': {'hasWorkflowState': 'published'}}, {'term': {'sectors': 'Health'}}, {'term': {'include_in_observatory': 'True'}}],
  //predefined_filters: [{'term': {'hasWorkflowState': 'published'}}, {'term': {'include_in_observatory': 'True'}}, {'term': {'typeOfData': 'Indicator', 'Tools', 'Guidance'}}],



  predefined_filters: [
      {'term': {'hasWorkflowState': 'published'}},
      {'term': {'include_in_observatory': 'True'}}
  ],

  //predefined_filters: [{'term': [{'hasWorkflowState': 'published'},{'sectors':'Health'}]}],
  /*
  predefined_filters : [
        {
            'constant_score': {
                'filter': {
                    'bool': {
                        'should': [
                            {
                                'bool': {
                                    'must': {'match': {'sectors': 'Health'}}
                                }
                            },
                            {
                                'bool': {
                                    'must': {'match': {'typeOfData': 'Indicators'}},
                                    'should': [
                                        {'bool': {'must_not': {'exists': {'field': 'expires'}}}},
                                        {'range': {'expires': {'gte': today}}}
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    ],
    */
  sort: [{'issued': {'order': 'desc'}}]
  /*
    predefined_filters : [
        {'term': {'hasWorkflowState': 'published'}},
        {
            'constant_score': {
                'filter': {
                    'bool': {
                        'should': [
                            {'bool':{'must_not':{'exists': {'field': 'issued'}}}},
                            {'range': {'issued': {'lte': today}}}
                        ]
                    }
                }
            }
        },
        {
            'constant_score': {
                'filter': {
                    'bool': {
                        'should': [
                            {'bool': {'must_not': {'exists': {'field': 'expires'}}}},
                            {'range': {'expires': {'gte': today}}}
                        ]
                    }
                }
            }
        }
    ]
    */
};

if($.getUrlVars({}).SearchableText !== undefined){
  window.esbootstrap_options.q = $.getUrlVars({}).SearchableText;
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

function checkDefaultArticle(){
    params = new URLSearchParams(window.location.search);
    source = params.get('source');
    sourceData = JSON.parse(source);
    path = '';

    if (sourceData && sourceData.hasOwnProperty('focusPath') && sourceData['focusPath'].charAt(0) == '/') {
        path = sourceData['focusPath'];
    }
    return path;
}

function updateResult(element, result){
  $('#facetview_article').addClass('hide');
  $('#facetview_rightcol').removeClass('hide');
  result = updateContentTypes(element, result);
  updateLanguageLinks();
  return(result);
}
