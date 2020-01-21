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
                $(value).find(".year_facet_checkbox").removeAttr("readonly");
                $(value).find(".year_facet_value").removeAttr("readonly");
                $(value).find(".year_facet_count").removeAttr("readonly");
                // var group_id = $(value).find(".year_facet_checkbox").attr("group_id");
                // $("[facet_type='group'][group_id='" + group_id + "']").removeAttr("readonly");
                // $(".year_facet_group[group_id='" + group_id + "']").find(".year_facet_group_value").removeAttr("readonly");
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
                $(value).find(".status_facet_checkbox").removeAttr("readonly");
                $(value).find(".status_facet_value").removeAttr("readonly");
                $(value).find(".status_facet_count").removeAttr("readonly");
                // var group_id = $(value).find(".status_facet_checkbox").attr("group_id");
                // $("[facet_type='group'][group_id='" + group_id + "']").removeAttr("readonly");
                // $(".status_facet_group[group_id='" + group_id + "']").find(".status_facet_group_value").removeAttr("readonly");
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
        debugger;
        $('.facet-view-simple').facetview.dosearch();
    };

    var checkAllFacets = function(exec_search){
        if (exec_search){
            dosearch();
        }
    };

    $('.year_facet_checkbox[facet_type="facet"]').change(function() {
        debugger;
        checkAllFacets(true);
    });

    $('.status_facet_checkbox[facet_type="facet"]').change(function() {
        debugger;
        checkAllFacets(true);
    });


    $('.year_facet_value, .status_facet_value').click(function(ev) {
        var el = $(ev.target);
        if (el.attr('readonly')) {
            return;
        }
        var checkbox = el.prev();
        checkbox.click();
        checkAllFacets(true);
    });
};


var year_entry_template = '<div class="year_facet" rel="placeholder">' +
'   <input class="year_facet_checkbox" type="checkbox" value="Year" facet_type="facet" group_id="0">' +
'   <div class="year_facet_value">Air pollution</div>' +
'   <div class="year_facet_count">1</div>' +
'</div>';

var year_facet_template = '<div class="year-facet-section">' +
'    <div class="year-facet-title"> </div>' +
'    <div class="year-facet-group">' +
'    </div>' +
'</div>';

var status_entry_template = '<div class="status_facet" rel="placeholder">' +
'   <input class="status_facet_checkbox" type="checkbox" value="Status" facet_type="facet" group_id="0">' +
'   <div class="status_facet_value">Air pollution</div>' +
'   <div class="status_facet_count">1</div>' +
'</div>';

var status_facet_template = '<div class="status-facet-section">' +
'    <div class="status-facet-title"> </div>' +
'    <div class="status-facet-group">' +
'    </div>' +
'</div> ';

// add extra functionalities after the list was displayed or a search was done.
$(window).bind('post_init_callback', function(){
    // hide the filters
    $('h2#Status').parent().hide();
    $('h2#year').parent().hide()

    var query = '{"query":{"bool":{}},"aggs":{"Status":{"terms":{"field":"Status","size":1000000,"order":{"_key":"asc"}}},"year":{"terms":{"field":"year","size":1000000,"order":{"_key":"desc"}}}},"sort":[],"size":0}';
    var url = window.location.origin + "/tools/api?source=" + query;

    $.ajax({url: url, success: function(result){
        years = result.aggregations.year.buckets;
        status_arr = result.aggregations.Status.buckets;
        $(year_facet_template).insertAfter($('.content h3')[0]);
        $(status_facet_template).insertAfter($('.content h3')[0]);

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

            $('.year-facet-section').children('.year-facet-group').append(clone[0]);
        });
        $.each(status_arr, function(idx, item) {
            var clone = $(status_entry_template).clone();
            var checkbox = $(clone).children('.status_facet_checkbox');
            var status_value = $(clone).children('.status_facet_value');
            var status_count = $(clone).children('.status_facet_count');

            $(clone).attr('rel', item.key)
            $(checkbox).attr('value', item.key);
            $(checkbox).attr('group_id', idx);
            $(status_value).text(item.key);
            $(status_count).text(item.doc_count);

            $('.status-facet-section').children('.status-facet-group').append(clone[0]);
        });
        $(".year-facet-section").coFacet();
        $(".status-facet-section").coFacet();
    },
    error: function(error) {
        debugger;
    }
    });
});

$(window).bind('post_search_callback', function(){
    $(".year-facet-section").coFacet.loadValuesFromFacet();
});
