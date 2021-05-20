/* Add custom js here */
/* customize esbootstrap options by adding the following global options object
window.esbootstrap_options = {
    initial_search: false,
    enable_rangeselect: true,
    enable_geoselect: true
}
*/

$.fn.coFacet = function(settings){

    $.fn.coFacet.loadValuesFromFacet = function(){
        var found_year = false;
        var found_status = false;
        $.each($(".year_facet"), function(key, value){
            var facet_value = $(value).attr("rel");
            var real_facet_option = $('li[rel="year"][title="' + facet_value + '"]');
            if (real_facet_option.length > 0){
                found_year = true;
                var count = $(real_facet_option).find(".facet_label_count").text();
                $(value).find(".year_facet_count").text(count);
                var checked = $(real_facet_option).find(".jstree-anchor").hasClass("jstree-clicked");
                if (checked){
                    $(value).find(".year_facet_checkbox").prop("checked", true);
                }
                else {
                    $(value).find(".year_facet_checkbox").prop("checked", false);
                }
            }
        });
        $.each($(".status_facet"), function(key, value){
            var facet_value = $(value).attr("rel");
            var real_facet_option = $('li[rel="Status"][title="' + facet_value + '"]');
            if (real_facet_option.length > 0){
                found_status = true;
                var count = $(real_facet_option).find(".facet_label_count").text();
                $(value).find(".status_facet_count").text(count);
                var checked = $(real_facet_option).find(".jstree-anchor").hasClass("jstree-clicked");
                if (checked){
                    $(value).find(".status_facet_checkbox").prop("checked", true);
                }
                else {
                    $(value).find(".status_facet_checkbox").prop("checked", false);
                }
            }
        });
        if (!found_year || !found_status){
            setTimeout(loadValuesFromFacet, 100);
        }
        else {
            checkAllFacets(false);
        }
    };

    var loadValuesFromFacet = $.fn.coFacet.loadValuesFromFacet;

    var dosearch = function(){
        var checked_facets = $('.year_facet_checkbox[facet_type="facet"]:checked');
        var unchecked_facets = $('.year_facet_checkbox[facet_type="facet"]:not(:checked)');
        $.each(unchecked_facets, function(key, facet){
            var value = $(facet).attr("value");
            var clearbtn = $('.facetview_filterselected.facetview_clear[rel="year"][href="' + value + '"]');
            $('.facet-view-simple').facetview.clearfilter(false, "year", clearbtn, false);
        });
        $.each(checked_facets, function(key, facet){
            var value = $(facet).attr("value");
            $('.facet-view-simple').facetview.clickfilterchoice(false, "year", value, false);
        });

        var checked_facets = $('.status_facet_checkbox[facet_type="facet"]:checked');
        var unchecked_facets = $('.status_facet_checkbox[facet_type="facet"]:not(:checked)');
        $.each(unchecked_facets, function(key, facet){
            var value = $(facet).attr("value");
            var clearbtn = $('.facetview_filterselected.facetview_clear[rel="Status"][href="' + value + '"]');
            $('.facet-view-simple').facetview.clearfilter(false, "Status", clearbtn, false);
        });
        $.each(checked_facets, function(key, facet){
            var value = $(facet).attr("value");
            $('.facet-view-simple').facetview.clickfilterchoice(false, "Status", value, false);
        });
        $('.facet-view-simple').facetview.dosearch();
    };

    var checkAllFacets = function(exec_search){
        if (exec_search){
            dosearch();
        }
    };

    $('.year_facet_checkbox[facet_type="facet"]').change(function() {
        checkAllFacets(true);
    });

    $('.status_facet_checkbox[facet_type="facet"]').change(function() {
        checkAllFacets(true);
    });

    $('.year_facet_value').click(function(ev) {
        var el = $(ev.target);
        if (el.attr('readonly')) {
            return;
        }
        var checkbox = el.prev();
        checkbox.click();
        checkAllFacets(true);
        var parent = el.parent();
        if (checkbox.prop('checked')) {
            parent.css('background-color', '#cd7');
        }
        else {
            parent.css('background-color', '#F0F0F0');
        }

    });

    $('.status_facet_value').click(function(ev) {
        var el = $(ev.target);
        if (el.attr('readonly')) {
            return;
        }
        var checkbox = el.prev();
        checkbox.click();
        checkAllFacets(true);
        var parent = el.parent();
        if (checkbox.prop('checked')) {
            parent.css('background-color', '#cd7');
        }
        else {
            parent.css('background-color', '#F0F0F0');
        }
    });
    // loadValuesFromFacet();
};


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

// add extra functionalities after the list was displayed or a search was done.
$(window).bind('post_init_callback', function(){
    // hide the filters
    $('h2#Status').parent().hide();
    $('h2#year').parent().hide()

    var query = '{"query":{"bool":{}},"aggs":{"Status":{"terms":{"field":"Status","size":1000000,"order":{"_key":"asc"}}},"year":{"terms":{"field":"year","size":1000000,"order":{"_key":"desc"}}}},"sort":[],"size":0}';
    var base_url = window.location.origin + "/tools/api?source=";
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        years = result.aggregations.year.buckets;
        status_arr = result.aggregations.Status.buckets;
        $(year_facet_template).insertAfter($('.current-filters')[0]);
        $(status_facet_template).insertAfter($('.current-filters')[0]);

        if ($('.facet-view-simple').facetview.options.isInitialSearch) {
            query = '{"query": {"bool": {"must": [{"term": {"year": "LAST_YEAR"}},{"match": {"Status": "f"}}],"must_not": [],"should": []}},"sort": [],"size": 0}';
            url = base_url + query.replace("LAST_YEAR", years[0].key);
            $.ajax({url: url, success: function(result){
                if (result.hits.total.value > 0) {
                    // check final checkbox
                    $('.status_facet_checkbox[value="f"]').trigger("click");
                }
                else {
                    // check provisional checkbox
                    $('.status_facet_checkbox[value="p"]').trigger("click");
                }
            }});
        }

        $.each(years, function(idx, item) {
            var clone = $(year_entry_template).clone();
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
        });

        $.each(status_arr, function(idx, item) {
            var clone = $(status_entry_template).clone();
            var checkbox = $(clone).children('.status_facet_checkbox');
            var status_value = $(clone).children('.status_facet_value');
            var status_count = $(clone).children('.status_facet_count');

            $(clone).attr('rel', item.key)
            $(checkbox).attr('value', item.key);
            $(checkbox).attr('group_id', idx);

            if (item.key === "f") {
                item.key = "Final data";
            }
            else {
                item.key = "Provisional data";
            }

            $(status_value).text(item.key);
            $(status_count).text(item.doc_count);

            $('.status-facet-section').children('.status_facet_group').append(clone[0]);
        });
        $(".year-facet-section").coFacet();
        // $(".status-facet-section").coFacet();
    },
    error: function(error) {
        console.log(error);
    }
    });


});

$(window).bind('post_search_callback', function(){
    $('.year_facet_checkbox:checked, .status_facet_checkbox:checked').parent().css('background-color', '#cd7');
    $('.year_facet_checkbox:not(:checked), .status_facet_checkbox:not(:checked)').parent().css('background-color', '#F0F0F0');
    $(".year-facet-section").coFacet.loadValuesFromFacet();
    $(".status-facet-section").coFacet.loadValuesFromFacet();
});
