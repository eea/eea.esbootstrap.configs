/* globals $, setTimeout */

$.fn.carFacet = function(settings){

    var loadValuesFromFacet = function(){
        var found = false;
        $.each($(".car_facet"), function(key, value){
            var facet_value = $(value).attr("rel");
            var real_facet_option = $('li[rel="http://www.eea.europa.eu/portal_types#topic"][title="' + facet_value + '"]');
            if (real_facet_option.length > 0){
                found = true;
                var count = $(real_facet_option).find(".facet_label_count").text();
                $(value).find(".car_facet_count").text(count);
                var checked = $(real_facet_option).find(".jstree-anchor").hasClass("jstree-clicked");
                if (checked){
                    $(value).find(".car_facet_checkbox").attr("checked", true);
                }
                $(value).find(".car_facet_checkbox").removeAttr("readonly");
                $(value).find(".car_facet_value").removeAttr("readonly");
                $(value).find(".car_facet_count").removeAttr("readonly");
                var group_id = $(value).find(".car_facet_checkbox").attr("group_id");
                $("[facet_type='group'][group_id='" + group_id + "']").removeAttr("readonly");
                $(".car_facet_group[group_id='" + group_id + "']").find(".car_facet_group_value").removeAttr("readonly");
            }
        });
        if (!found){
            setTimeout(loadValuesFromFacet, 100);
        }
        else {
            checkAllFacets(false);
        }
    };


    $('.car_facet_checkbox[facet_type="group"]').change(function() {
        var group_id = $(this).attr("group_id");
        if($(this).is(":checked")) {
            $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])').attr("checked", true);
        }
        else {
            $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])').attr("checked", false);
        }
        dosearch();
    });

    var dosearch = function(){
        var checked_facets = $('.car_facet_checkbox[facet_type="facet"]:checked');
        var unchecked_facets = $('.car_facet_checkbox[facet_type="facet"]:not(:checked)');
        $.each(unchecked_facets, function(key, facet){
            var value = $(facet).attr("value");
            var clearbtn = $('.facetview_filterselected.facetview_clear[rel="http://www.eea.europa.eu/portal_types#topic"][href="' + value + '"]');
            $('.facet-view-simple').facetview.clearfilter(false, "http://www.eea.europa.eu/portal_types#topic", clearbtn, false);
        });
        $.each(checked_facets, function(key, facet){
            var value = $(facet).attr("value");
            $('.facet-view-simple').facetview.clickfilterchoice(false, "http://www.eea.europa.eu/portal_types#topic", value, false);
        });
        $('.facet-view-simple').facetview.dosearch();
    };

    var checkAllFacets = function(exec_search){
        $.each($('.car_facet_checkbox[facet_type="group"]:not([readonly])'), function(key, value){
            var group_id = $(value).attr("group_id");
            var available_facets = $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])');
            var checked_facets = $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:checked:not([readonly])');
            if (checked_facets.length === available_facets.length){
                $('.car_facet_checkbox[facet_type="group"][group_id="'+group_id+'"]:not([readonly])').attr("checked", true);
            }
            else {
                $('.car_facet_checkbox[facet_type="group"][group_id="'+group_id+'"]:not([readonly])').attr("checked", false);
            }
        });
        if (exec_search){
            dosearch();
        }
    };

    $('.car_facet_checkbox[facet_type="facet"]').change(function() {
        checkAllFacets(true);
    });

    loadValuesFromFacet();
};
