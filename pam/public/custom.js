function fixHeights(){
    $.each($("#facetview_results tbody tr td"), function (idx, elem){
        var newelem = $("<div class='eea-pam-element' title='"+$(elem).text()+"'>").append($(elem).html());
        $(elem).html("");
        $(elem).append(newelem);
    })
    return;
    $.each($(".eea-pam-element"), function(idx, elem){
        var full_text = $(elem).text();
        var min_length = 0;
        var max_length = $(elem).text().length;
        var middle = max_length;
        while (true){
            var visibleWidth = $(elem).width();
            var visibleHeight = $(elem).height();
            var scrollWidth = $(elem)[0].scrollWdith;
            var scrollHeight = $(elem)[0].scrollHeight;

            if ((scrollHeight > visibleHeight) || (scrollWidth > visibleWidth)){
                max_length = middle;
                middle = Math.floor((max_length + min_length) / 2);
                $(elem).text(full_text.substr(0, middle) + "...");
            }
            else {
                min_length = middle;
                if ($(elem).text().length === max_length){
                    break;
                }
                if (max_length - min_length < 3){
                    break;
                }
                middle = Math.floor((max_length + middle) / 2);
                $(elem).text(full_text.substr(0, middle) + "...");
            }
        }
    });
}



function removeMissingDetails(){
    $.each($(".details_link"), function(idx, link){
        href = $(link).attr("href");
        if ((href === undefined) || (href === "")){
            var tmp_text = $(link).text();
            var container = $(link).parent()
            $(container).text(tmp_text);
            $(link).remove();
        } else {
            $(link).attr("href", href.replace(/ /g, '_'));
        }
    });
}

function viewReady(){
    addHeaders("#facetview_results");
    replaceNumbers();
    fixDataTitles();
    removeMissingDetails();
    fixHeights();
}

jQuery(document).ready(function($) {
    var default_sort = [{}, {}];
    default_sort[0][field_base + 'Country'] = {"order": 'asc'};
    default_sort[1][field_base + 'ID_of_policy_or_measure'] = {"order": 'asc'};
    eea_facetview('.facet-view-simple',
        {
            default_sort: default_sort,
            search_url: './api',
            search_index: 'elasticsearch',
            datatype: 'json',
            initial_search: false,
            enable_rangeselect: true,
            enable_geoselect: true,
            post_init_callback: function() {
              add_EEA_settings();
            },
            post_search_callback: function() {
              add_EEA_settings();
              viewReady();
              replaceNumbers();
            },
            paging: {
                from: 0,
                size: 10
            }
        });
});
