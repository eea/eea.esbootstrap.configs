var today = getTodayWithTime();

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
        size: 30
    },
    display_type: 'list',
    resultModifier: updateResult,
    initialsearch: true,
    predefined_filters: [{'term': {'hasWorkflowState': 'published'}}],
    /*predefined_filters : [
        {
            'constant_score': {
                'filter': {
                    'bool': {
                        'should': [
                            {
                                'bool': {
                                    'must_not': {'match': {'typeOfData': 'Indicators'}}
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
    ],*/
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

function updateResult(element, result){
    result = updateContentTypes(element, result);
    return(result);
}
