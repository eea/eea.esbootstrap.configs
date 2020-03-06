function getMinMaxYear(callback){
    query = '{"query": {"bool": {}},"aggs": {"max_year": {"max": {"field": "year"}},"min_year": {"min": {"field": "year"}}},"size": 0}'
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        callback(result.aggregations.min_year.value, result.aggregations.max_year.value)
    }
    });
}

function getStatus(min, max, callback){
    query = '{"query": {"bool": {"must": [{"term": {"year": "' + max + '"}},{"match": {"Status": "F"}}],"must_not": [],"should": []}},"sort": [],"size": 0}';
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        status = 'P';
        if (result.hits.total > 0) {
            status = 'F'
        }
        callback(min, max, status);
    }
    });
}

var year_entry_template = '<div class="year_facet" rel="placeholder">' +
'   <input class="year_facet_checkbox" type="checkbox" value="Year" facet_type="facet" group_id="0">' +
'   <div class="year_facet_value"></div>' +
'   <div class="year_facet_count">1</div>' +
'</div>';

var year_facet_template = '<div class="year-facet-section">' +
'    <div class="year_facet_title">' +
'        <span class="year_facet_title--text">Registration year</span>' +
'        <span class="year_facet_title--text-border"></span></div>' +
'    <div class="year_facet_group">' +
'    </div>' +
'</div>';

var status_entry_template = '<div class="status_facet" rel="placeholder">' +
'   <input class="status_facet_checkbox" type="checkbox" value="Status" facet_type="facet" group_id="0">' +
'   <div class="status_facet_value"></div>' +
'   <div class="status_facet_count">1</div>' +
'</div>';

var status_facet_template = '<div class="status-facet-section">' +
'    <div class="status_facet_title">' +
'        <span class="status_facet_title--text">Type of data</span>' +
'        <span class="status_facet_title--text-border"></span></div>' +
'    <div class="status_facet_group">' +
'    </div>' +
'</div> ';

function getCustomFacets(){
    var url = $(location).attr('href');
    if (url.split("?source=").length === 2){
        var source_str = url.split("?source=")[1];
        source_str = decodeURIComponent(source_str);
        var source_query = JSON.parse(source_str);

        var and_terms = {};
        var or_terms = {};
        var query_string = '';
        var ranges = {};
        var geo_distancess = {};
        var geo_boxes = {};

        function parseQueryTree(queryTree, queryPath){
            if ($.isArray(queryTree)){
                for (var i = 0; i < queryTree.length; i++){
                    queryPath.push('listitem');
                    parseQueryTree(queryTree[i], queryPath)
                }
            }
            else if ($.type(queryTree) === 'object'){
                $.each(Object.keys(queryTree), function(idx, key){
                    queryPath.push(key);
                    parseQueryTree(queryTree[key], queryPath);
                });
            }
            else {
                if (queryPath[queryPath.length - 2] === 'term') {
                    var tmp_terms;
                    if (queryPath[queryPath.length - 4] === 'must'){
                        tmp_terms = and_terms;
                    }
                    if (queryPath[queryPath.length - 4] === 'should'){
                        tmp_terms = or_terms;
                    }
                    if (tmp_terms[queryPath[queryPath.length - 1]] === undefined){
                        tmp_terms[queryPath[queryPath.length - 1]] = [];
                    }
                    tmp_terms[queryPath[queryPath.length - 1]].push(queryTree);
                }
                if ((queryPath[queryPath.length - 2] === "query_string")&& (queryPath[queryPath.length - 1] === 'query')){
                    query_string = queryTree;
                }
                if (queryPath[queryPath.length - 3] === 'range'){
                    if (ranges[queryPath[queryPath.length - 2]] === undefined){
                        ranges[queryPath[queryPath.length - 2]] = {};
                    }
                    ranges[queryPath[queryPath.length - 2]][queryPath[queryPath.length - 1]] = queryTree;
                }
            }
            queryPath.splice(-1, 1);
        }
        parseQueryTree(source_query, []);
        var tmp_year = []
        for (var i = 0; i < or_terms.year.length; i++){
            tmp_year.push(parseInt(or_terms.year[i]));
        }
        return {year: tmp_year, status: or_terms.Status};
    }
    return {}
}

function buildPredefinedFilters(year, status){
    var predefined_filters = [
        {
            'constant_score': {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "bool": {
                                    "should": [
/*                                      {
                                            "term": {
                                                "year": "2018"
                                            }
                                        },
                                        {
                                            "term": {
                                                "year": "2017"
                                            }
                                        }*/
                                    ]
                                }
                            },
                            {
                                "bool": {
                                    "should": [
/*                                      {
                                            "term": {
                                                "Status": "P"
                                            }
                                        },
                                        {
                                            "term": {
                                                "Status": "F"
                                            }
                                        }*/
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    ]
    var i;
    for (i = 0; i < year.length; i++){
        var tmp_term = {"term":{"year":year[i]}}
        predefined_filters[0].constant_score.filter.bool.must[0].bool.should.push(tmp_term);
    }

    for (i = 0; i < status.length; i++){
        var tmp_term = {"term":{"Status":status[i]}}
        predefined_filters[0].constant_score.filter.bool.must[1].bool.should.push(tmp_term);
    }
    return predefined_filters
}

function updatePredefinedFilters(){
    var year = [];
    var status = [];
    $(".year_facet.selected").each(function(idx, facet){
        year.push($(facet).attr("rel"));
    })
    $(".status_facet.selected").each(function(idx, facet){
        status.push($(facet).attr("rel"));
    })
    if (year.length === 0){
        year = [-1];
    }
    if (status.length === 0){
        status = ['x']
    }
    $('.facet-view-simple').facetview.options.predefined_filters = buildPredefinedFilters(year, status);
    $('.facet-view-simple').facetview.dosearch();

}

function createCustomFacets(){
    if ($(".status-facet-section").length > 0) {
        return;
    }
//    $(".status-facet-section").remove();
//    $(".year-facet-section").remove();
//    $(status_facet_template).insertAfter($('.content h3')[0]);
    $(year_facet_template).insertAfter($('.current-filters')[0]);
    $(status_facet_template).insertAfter($('.current-filters')[0]);

    status_arr = [ {key:'F'}, {key:'P'}]
    var tmp_facets = getCustomFacets();


    $.each(status_arr, function(idx, item) {
        var clone = $(status_entry_template).clone();
        if (tmp_facets.status.indexOf(item.key) !== -1){
            clone.addClass("selected");
        }
        var checkbox = $(clone).children('.status_facet_checkbox');
        var status_value = $(clone).children('.status_facet_value');
        var status_count = $(clone).children('.status_facet_count');

        $(clone).attr('rel', item.key)
        $(checkbox).attr('value', item.key);
        $(checkbox).attr('group_id', idx);

        if (item.key === "F") {
            item.key = "Final data";
        }
        else {
            item.key = "Provisional data";
        }

        $(status_value).text(item.key);
        $(status_count).text(item.doc_count);

        $('.status-facet-section').children('.status_facet_group').append(clone[0]);

        clone.click(function(el){
            if ($(el.delegateTarget).hasClass('selected') !== true) {
                // always have a type of data selected
                $('.status_facet').removeClass('selected');
                $(el.delegateTarget).toggleClass('selected');
                updatePredefinedFilters();
            }
        })
    });

    getMinMaxYear(function(min,max){

        var years = [];
        for (var i = max; i >= min; i--){
            years.push({key:i});
        }
        $.each(years, function(idx, item) {
            var clone = $(year_entry_template).clone();
            if (tmp_facets.year.indexOf(item.key) !== -1){
                clone.addClass("selected");
            }
            var checkbox = $(clone).children('.year_facet_checkbox');
            var year_value = $(clone).children('.year_facet_value');
            var year_count = $(clone).children('.year_facet_count');

            $(clone).attr('rel', item.key)
            $(checkbox).attr('value', item.key);
            $(checkbox).attr('group_id', idx);
            $(year_value).text(item.key);
            $(year_count).text(item.doc_count);

            // check the latest year
            if (idx === 0) {
                $(checkbox).prop("checked", true)
            }

            $('.year-facet-section').children('.year_facet_group').append(clone[0]);
            clone.click(function(el){
                $(el.delegateTarget).toggleClass('selected');
                updatePredefinedFilters();
            })
        });
    });
}

function addSpinner() {
    if ($('.facetview_tree .eea-icon-spinner').length <= 0) {
        $('.facetview_tree').append('<span class="eea-icon eea-icon-spinner eea-icon-3x eea-icon-anim-spin animated"></span>');
    }
}

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
            createCustomFacets();
            addSpinner();

            add_EEA_settings();
            viewReady();
            replaceNumbers();

            if ($('.no-results-message').is(':visible')) {
                $('.eea-icon-spinner').hide();
            }

            $(window).trigger('post_search_callback');

            $('.current-filters').show();
            if ($('.facetview-filter-values').children().length < 1) {
                $('.status-facet-section').css("padding-top", "0.5em");
                $('.facetview-filter-values').css("margin-bottom", "5px");
            }
            else {
                $('.status-facet-section').css("padding-top", 0);
                $('.facetview-filter-values').css("margin-bottom", 0);
            }
        },
        paging: {
            from: 0,
            size: 10
        },
        display_type_options: settings_display_options,
        display_type: settings_default_display,
        enable_async_load: true
    };
    if (window.esbootstrap_options) {
       $.extend(opts, esbootstrap_options);
    }
    if ((eea_mapping.highlights !== undefined) && (eea_mapping.highlights.enabled)){
        opts.highlight_enabled = eea_mapping.highlights.enabled;
        opts.highlight_whitelist = eea_mapping.highlights.whitelist;
        opts.highlight_blacklist = eea_mapping.highlights.blacklist;
    }

    $('ul.tabs .tab-link').click(function(el){
        el.preventDefault();
        if ($(el.delegateTarget).hasClass('selected') !== true) {
            // always have a tab selected
            $('ul.tabs .selected').removeClass('selected');
            $(el.delegateTarget).toggleClass('selected');

            var parent = $(el.delegateTarget).parent();
            var element_id = '#' + parent.attr('class');
            $('.tabs-content .selected').removeClass('selected');
            $('.tabs-content ' + element_id).toggleClass('selected');
        }
        else {
            console.log("Tab is already selected");
            return;
        }
    })

    getMinMaxYear(function(min, max){
        getStatus(min, max, function(min, max, status){
            var tmp_facets = getCustomFacets();
            if (tmp_facets.year === undefined){
                tmp_facets.year = [max];
            }
            if (tmp_facets.status === undefined){
                tmp_facets.status = [status];
            }
            opts.predefined_filters = buildPredefinedFilters(tmp_facets.year, tmp_facets.status);
            eea_facetview('.facet-view-simple', opts);
        })
    })
});
