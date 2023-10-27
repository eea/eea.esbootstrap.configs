/* global jQuery, $, window, document */
function fixHeights() {
    $.each($("#facetview_results").find('td'), function (idx, elem) {

        // var text = elem.innerText;
        // if (text.length > 103) {
        //     elem.innerText = text.substr(0, 103) + "...";
        // }
        var newelem = $("<div class='eea-pam-element' title='"+$(elem).text()+"'>").append($(elem).html());
        $(elem).html("");
        $(elem).append(newelem);
    });

    $.each($(".eea-pam-element"), function(idx, elem){
        if ($(elem).text() !== $(elem).html()){
            return;
        }
        var full_text = $(elem).text();
        var min_length = 0;
        var max_length = $(elem).text().length;
        var middle = max_length;
        while (true){
            var visibleWidth = $(elem).width();
            var visibleHeight = $(elem).height();
            var scrollWidth = $(elem)[0].scrollWidth;
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
        var href = $(link).attr("href");
        if ((href === undefined) || (href === "")){
            var tmp_text = $(link).text();
            var container = $(link).parent();
            $(container).text(tmp_text);
            $(link).remove();
        } else {
            $(link).attr("href", href.replace(/ /g, '_'));
        }
    });
}

var default_sort = [{}, {}];
var field_base = window.field_base;
default_sort[0][field_base + 'Country'] = {"order": 'asc'};
default_sort[1][field_base + 'ID_of_policy_or_measure'] = {"order": 'asc'};

window.esbootstrap_options = {
    default_sort: default_sort
};

function updateNumbers(){
    var possibleContainers = ['.results_text', '.facet_label_text', '.facetview_selection span'];
    var chemsMapping = {'CH4':'CH<sub>4</sub>',
                        'CO2':'CO<sub>2</sub>',
                        'SO2':'SO<sub>2</sub>',
                        'O3':'O<sub>3</sub>',
                        'N2O':'N<sub>2</sub>O',
                        'NO2':'NO<sub>2</sub>',
                        'NOx':'NO<sub>x</sub>',
                        'NF3':'NF<sub>3</sub>',
                        'NH3':'NH<sub>3</sub>',
                        'C6H6':'C<sub>6</sub>H<sub>6</sub>',
                        'SF6':'SF<sub>6</sub>'};
    jQuery.each(possibleContainers, function(idx, container){
        var elems = jQuery(container);
        jQuery.each(elems, function(idx, elem){
            var shouldReplace = false;
            var replacedText = elem.innerHTML;
            jQuery.each(chemsMapping, function(key, value){
                if (replacedText.indexOf(key) !== -1){
                    replacedText = replacedText.split(key).join(value);
                    shouldReplace = true;
                }
            });
            if (shouldReplace){
                elem.innerHTML = replacedText;
            }
        });
    });

}
function fixTable(){
    if ($("#facetview_results").find('tr').length < 2){
        $("#facetview_results_wrapper").hide();
    }
    else{
        $("#facetview_results_wrapper").show();
    }
}
jQuery(document).ready(function($) {
    $(window).bind('post_search_callback', function(){
        removeMissingDetails();
        updateNumbers()
        fixTable();
        // fixHeights();
    });
});
