function getMinMaxYear(callback){
    query = '{"query": {"bool": {}},"aggs": {"max_year": {"max": {"field": "year"}},"min_year": {"min": {"field": "year"}}},"size": 0}'
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        callback(result.aggregations.min_year.value, result.aggregations.max_year.value)
    }
    });
}

function getStatus(min, max, callback){
    query = '{"query": {"bool": {"must": [{"term": {"year": "' + max + '"}},{"match": {"scStatus": "Final"}}],"must_not": [],"should": []}},"sort": [],"size": 0}';
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        status = 'Provisional';
        if (result.hits.total > 0) {
            status = 'Final'
        }
        callback(min, max, status);
    }
    });
}

var year_entry_template = ''+
'<li role="treeitem" rel="co2_year" title="" id="j1_1" class="year_facet jstree-node facetview_filterchoice leaf jstree-leaf" aria-selected="true">'+
//'<i class="jstree-icon jstree-ocl"></i>'+
'<a class="jstree-anchor" href="#">'+
'<i class="jstree-icon jstree-checkbox"></i>'+
'<i class="jstree-icon jstree-themeicon"></i>'+
'<span class="facet_label_text"></span>'+
'</a>'+
'</li>';



var year_facet_template = ''+
'<div class="facetview_filter eea-accordion-panel"> '+
'<h2 class="facetview_showtree  i18n notoc eea-icon-right-container" title="Registration year" id="co2_year" eea_rel="co2_year">' +
'<div class="facetview_showtree_eealabel">Registration year</div>'+
'<span class="facetview_arrow_right eea-icon eea-icon-right"></span> <div style="clear:both"> </div>'+
'</h2>' +
'<div class="year-facet-section">' +
'    <ul class="year_facet_group">' +
'    </ul>' +
'</div> ';


var status_entry_template = ''+
'<li role="treeitem" rel="co2_status" title="" id="j1_1" class="status_facet jstree-node facetview_filterchoice leaf jstree-leaf" aria-selected="true">'+
//'<i class="jstree-icon jstree-ocl"></i>'+
'<a class="jstree-anchor" href="#">'+
'<i class="jstree-icon jstree-checkbox"></i>'+
'<i class="jstree-icon jstree-themeicon"></i>'+
'<span class="facet_label_text"></span>'+
'</a>'+
'</li>';


var status_facet_template = '' +
'<div class="facetview_filter eea-accordion-panel"> '+
'<h2 class="facetview_showtree  i18n notoc eea-icon-right-container" title="Status" id="co2_status" eea_rel="co2_status">' +
'<div class="facetview_showtree_eealabel">Status</div>'+
'<span class="facetview_arrow_right eea-icon eea-icon-right"></span> <div style="clear:both"> </div>'+
'</h2>' +
'<div class="status-facet-section">' +
'        <ul class="status_facet_group">' +
'        </ul>' +
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
        return {year: tmp_year, status: or_terms.scStatus};
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
        var tmp_term = {"term":{"scStatus":status[i]}}
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

    $("#facetview_trees").prepend(year_facet_template);
    $("#facetview_trees").prepend(status_facet_template);

    $("#co2_status.facetview_showtree").click(function(el){
        if ($(el.delegateTarget).hasClass("facetview_open")){
            $(el.delegateTarget).removeClass("facetview_open");
            $(".status-facet-section").slideUp("fast");
        }
        else {
            $(el.delegateTarget).addClass("facetview_open");
            $(".status-facet-section").slideDown("fast");
        }
    })

    $("#co2_year.facetview_showtree").click(function(el){
        if ($(el.delegateTarget).hasClass("facetview_open")){
            $(el.delegateTarget).removeClass("facetview_open");
            $(".year-facet-section").slideUp("fast");
        }
        else {
            $(el.delegateTarget).addClass("facetview_open");
            $(".year-facet-section").slideDown("fast");
        }
    })

    status_arr = [ {key:'Final'}, {key:'Provisional'}]
    var tmp_facets = getCustomFacets();


    $.each(status_arr, function(idx, item) {
        var clone = $(status_entry_template).clone();
        if (tmp_facets.status.indexOf(item.key) !== -1){
            clone.addClass("selected");
            clone.find('.jstree-anchor').addClass('jstree-clicked')
        }
        var checkbox = $(clone).children('.status_facet_checkbox');
        var status_value = $(clone).find('.status_facet_value');

        $(clone).attr('rel', item.key)
        $(checkbox).attr('value', item.key);
        $(checkbox).attr('group_id', idx);

        if (item.key === "Final") {
            item.key = "Final";
        }
        else {
            item.key = "Provisional";
        }

        clone.attr("title", item.key);
        clone.find(".facet_label_text").text(item.key);

        $('.status-facet-section').children('.status_facet_group').append(clone[0]);

        clone.click(function(el){
            el.preventDefault();
            if ($(el.delegateTarget).hasClass('selected') !== true) {
                // always have a type of data selected
                $('.status_facet').removeClass('selected');
                $(el.delegateTarget).toggleClass('selected');

                $('.status_facet .jstree-anchor').removeClass('jstree-clicked')
                $(el.delegateTarget).find('.jstree-anchor').toggleClass('jstree-clicked');
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
                clone.find('.jstree-anchor').addClass('jstree-clicked')
            }
            var checkbox = $(clone).children('.year_facet_checkbox');
            var year_value = $(clone).children('.year_facet_value');

            $(clone).attr('rel', item.key)
            $(checkbox).attr('value', item.key);
            $(checkbox).attr('group_id', idx);
            $(year_value).text(item.key);

            clone.attr("title", item.key);
            clone.find(".facet_label_text").text(item.key);

            // check the latest year
            if (idx === 0) {
                $(checkbox).prop("checked", true)
            }

            $('.year-facet-section').children('.year_facet_group').append(clone[0]);
            clone.click(function(el){
                el.preventDefault();
                $(el.delegateTarget).toggleClass('selected');
                $(el.delegateTarget).find('.jstree-anchor').toggleClass('jstree-clicked');
                updatePredefinedFilters();
            })
            updateCurrentFacets();
        });
    });
}

function addSpinner() {
    if ($('.facetview_tree .eea-icon-spinner').length <= 0) {
        $('.facetview_tree').append('<span class="eea-icon eea-icon-spinner eea-icon-3x eea-icon-anim-spin animated"></span>');
    }
}

jQuery(document).bind("fixed_facet_checked",function(evt, params){
    add_EEA_settings();
    $(".facetview_filterselected[rel='scStatus']").prop("title", "Type of data can't be removed, just changed");
    $(".facetview_filterselected[rel='scStatus']").prop("alt", "Type of data can't be removed, just changed");

    if (params.rel === 'year'){
        if (!$(".year_facet[rel='"+params.title+"']").hasClass("selected")){
            $(".year_facet[rel='"+params.title+"']").click();
        }
    }

    if (params.rel === 'scStatus'){
        if (!$(".status_facet[rel='"+params.title+"']").hasClass("selected")){
            $(".status_facet[rel='"+params.title+"']").click();
        }
    }
})

jQuery(document).bind("fixed_facet_unchecked",function(evt, params){
    add_EEA_settings();
    $(".facetview_filterselected[rel='scStatus']").prop("title", "Type of data can't be removed, just changed");
    $(".facetview_filterselected[rel='scStatus']").prop("alt", "Type of data can't be removed, just changed");

    if (params.rel === 'year'){
        $(".year_facet[rel='"+params.title+"']").click();
    }

    if (params.rel === 'scStatus'){
        $("li[role='treeitem'][rel='scStatus'][title='Final'] a.jstree-anchor").click()
//        $(".status_facet[rel='"+params.title+"']").click();
    }
})

var current_facet_value_status_template = ''+
'    <div class="status_facetview_selection">'+
'        <span></span>'+
'        <a class="status_facetview_filterselected facetview_clear btn facetview_logic_or" rel="status" alt="Can\'t remove status" title="Can\'t remove status" href="">'+
'            <i class="icon-white eea-icon eea-icon-times"></i>'+
'        </a>'+
'    </div>';

var current_facet_section_status_template= ''+
'<div id="facetview_group_status" class="btn-group status_facetview_selected">'+
'    <h3 class="facetview_group_title">'+
'        <span class="title" style="font-size: inherit">Status:</span>'+
'    </h3>'+
'</div>';

var current_facet_value_year_template = ''+
'    <div class="year_facetview_selection">'+
'        <span></span>'+
'        <a class="year_facetview_filterselected facetview_clear btn facetview_logic_or" rel="year" alt="remove" title="remove" href="">'+
'            <i class="icon-white eea-icon eea-icon-times"></i>'+
'        </a>'+
'    </div>';

var current_facet_section_year_template= ''+
'<div id="facetview_group_year" class="btn-group year_facetview_selected">'+
'    <h3 class="facetview_group_title">'+
'        <span class="title" style="font-size: inherit">Registration year:</span>'+
'    </h3>'+
'</div>';


function updateResetFilters(){
    var refr_link = $(".eea-reset-filters").attr("href")
    refr_link = refr_link + "#refresh_filters";
    $(".eea-reset-filters").attr("href", refr_link);
}

function updateCurrentFacets(){
    $('.current-filters').show();
    $("#facetview_group_status").remove();
    $("#facetview_group_year").remove();


    $(".year_facet").each(function(idx, el){
        if($(el).hasClass("selected")){
            var clone = $(current_facet_value_year_template).clone();
            clone.find("span").text($(el).attr("rel"));
            if ($("#facetview_group_year").length === 0){
                $("#facetview_selected_filters").prepend(current_facet_section_year_template);
            }
            clone.appendTo("#facetview_group_year");

            clone.click(function(el){
                el.preventDefault();
                $(".year_facet[rel='"+$(el.delegateTarget).find("span").text()+"']").click()
            })
        }
    });

    $("#facetview_selected_filters").prepend(current_facet_section_status_template);
    $(".status_facet").each(function(idx, el){
        if($(el).hasClass("selected")){
            var clone = $(current_facet_value_status_template).clone();
            clone.find("span").text($(el).attr("rel"));
            clone.appendTo("#facetview_group_status");

            clone.click(function(el){
                el.preventDefault();
            })

        }
    });

    updateCurrentFacetsCounter();
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
            updateResetFilters();
            markNavigationTab(settings_selected_navigation_tab);
            updateCurrentFacets();
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

            updateCurrentFacets();
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
        if ($(el.delegateTarget).hasClass('selected_tab') !== true) {
            // always have a tab selected
            $('ul.tabs .selected_tab').removeClass('selected_tab');
            $(el.delegateTarget).toggleClass('selected_tab');

            var parent = $(el.delegateTarget).parent();
            var element_id = '#' + parent.attr('class');
            $('.tabs-content .selected_tab').removeClass('selected_tab');
            $('.tabs-content ' + element_id).toggleClass('selected_tab');
        }
        else {
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

    if ($(location).attr("hash") === '#refresh_filters'){
        $("ul.tabs .explorer-tab .tab-link").click()
    }
});
