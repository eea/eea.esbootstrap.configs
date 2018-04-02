/* globals $, setTimeout */
var debounce = function (func, threshold, execAsap) {
    var timeout;

    var obj = this;
    return function debounced () {

        function delayed () {
            if (!execAsap) {
                func.apply(obj, arguments);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        else if (execAsap) {
            func.apply(obj, arguments);
        }
        timeout = setTimeout(delayed, threshold || 100);
    };

};
$.fn.carFacet = function(settings){

    $.fn.carFacet.loadValuesFromFacet = function(){
        var found = false;
        $.each($(".car_facet"), function(key, value){
            var facet_value = $(value).attr("rel");
            var real_facet_option = $('li[rel="topic"][title="' + facet_value + '"]');
            if (real_facet_option.length > 0){
                found = true;
                var count = $(real_facet_option).find(".facet_label_count").text();
                $(value).find(".car_facet_count").text(count);
                var checked = $(real_facet_option).find(".jstree-anchor").hasClass("jstree-clicked");
                if (checked){
                    $(value).find(".car_facet_checkbox").prop("checked", true);
                }
                else {
                    $(value).find(".car_facet_checkbox").prop("checked", false);
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

    var loadValuesFromFacet = $.fn.carFacet.loadValuesFromFacet;

    $('.car_facet_checkbox[facet_type="group"]').change(function() {
        var group_id = $(this).attr("group_id");
        if($(this).is(":checked")) {
            $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])').prop("checked", true);
        }
        else {
            $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])').prop("checked", false);
        }
        dosearch();
    });

    var dosearch = function(){
        var checked_facets = $('.car_facet_checkbox[facet_type="facet"]:checked');
        var unchecked_facets = $('.car_facet_checkbox[facet_type="facet"]:not(:checked)');
        $.each(unchecked_facets, function(key, facet){
            var value = $(facet).attr("value");
            var clearbtn = $('.facetview_filterselected.facetview_clear[rel="topic"][href="' + value + '"]');
            $('.facet-view-simple').facetview.clearfilter(false, "topic", clearbtn, false);
        });
        $.each(checked_facets, function(key, facet){
            var value = $(facet).attr("value");
            $('.facet-view-simple').facetview.clickfilterchoice(false, "topic", value, false);
        });
        $('.facet-view-simple').facetview.dosearch();
    };

    var checkAllFacets = function(exec_search){
        $.each($('.car_facet_checkbox[facet_type="group"]:not([readonly])'), function(key, value){
            var group_id = $(value).attr("group_id");
            var available_facets = $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:not([readonly])');
            var checked_facets = $('.car_facet_checkbox[facet_type="facet"][group_id="'+group_id+'"]:checked:not([readonly])');
            if (checked_facets.length === available_facets.length){
                $('.car_facet_checkbox[facet_type="group"][group_id="'+group_id+'"]:not([readonly])').prop("checked", true);
            }
            else {
                $('.car_facet_checkbox[facet_type="group"][group_id="'+group_id+'"]:not([readonly])').prop("checked", false);
            }
        });
        if (exec_search){
            dosearch();
        }
    };

    $('.car_facet_checkbox[facet_type="facet"]').change(function() {
        checkAllFacets(true);
    });

    $('.car_facet_value, .car_facet_group_value').click(function(ev) {
        var el = $(ev.target);
        if (el.attr('readonly')) {
            return;
        }
        var checkbox = el.prev();
        checkbox.click();
        checkAllFacets(true);
    });
    loadValuesFromFacet();
    var section_language = $(".section-languages");
    var section_language_links = section_language.find('a');
    if (section_language_links.length > 1) {
        section_language.addClass('eea-tile-languages');
    }
    var facet_groups = $(".car_facet_group");
    var facet_title = $(".car_facet_title");
    var toggle_groups = function(ev){
        facet_groups.toggle(); 
    };
    if (window.innerWidth < 920) {
        facet_groups.css('display', 'none');
        //facet_title.click(toggle_groups);
    }
    var calculateLayout = function() {
        var events = $._data(facet_title[0], 'events');
        if (window.innerWidth < 920) {
            if (!events) {
                facet_title.click(toggle_groups);
            }
        }
        else { 
            if (events) {
                facet_title.off('click');
                facet_groups.show();
            }    
        }
    };
    var lazy = debounce(calculateLayout, 300);
    $(window).resize(lazy);

    var $site_bg_img = $(".site_bg_img");       
    var url = $site_bg_img.attr('data-src');      
    var loadBg = function() {
        if (window.innerWidth > 767) {
            if (!$site_bg_img.attr('src')) {
                $site_bg_img.attr('src', url);
            }
        }
    };
    
    var lazyBg = debounce(loadBg, 300);
    $(window).resize(lazyBg);

};
