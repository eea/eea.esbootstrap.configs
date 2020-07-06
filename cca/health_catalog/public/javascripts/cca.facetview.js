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
      add_EEA_settings();
      viewReady();
      replaceNumbers();
      limitString();
      $(window).trigger('post_search_callback');
      localArticleView();
      viewChartMode();
    },
    paging: {
      from: 0,
      size: 10
    },
    display_type_options: settings_display_options,
    display_type: settings_default_display
  };
  function viewChartMode() {
    if ($('.i18n.eea-icon.tabular.selected').length) {
        var resutls = $.fn.facetview.options.data;
      /*
      var content =
        '<div id="articleChart" style="border: 1px solid #000; width: 700px; height: 700px;overflow: hidden;"></div>'
        +'<script type="text/javascript" src="https://d3js.org/d3.v5.min.js"></script>'
        +'<script>console.log("test enter");showChart(getChartTree());</script>';
      $('#facetview_results_wrapper').html(content);
        */
        $('#facetview_results_wrapper').empty();
        showChart('facetview_results_wrapper', getChartTree());
    }
  }
  function localArticleView() {
    $('#faceview_article_back_to_list').click(function(event) {
        event.preventDefault();
        $('#facetview_article').addClass('hide');
        $('#facetview_rightcol').removeClass('hide');
        return false;
    });
    $('#facetview_results_wrapper a.eea-tileInner,a.state-published').click(function(event) {
      event.preventDefault();
      var pathName = $(this)[0].pathname;
      $.get(pathName+'?only_article=1', function(data) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, "text/html");
        $('#facetview_article_content').html(doc.getElementById("content-core"));

        $('.share-your-info-ace-button').addClass('hide');
        $('#facetview_article').removeClass('hide');
        $('#facetview_rightcol').addClass('hide');
      });
      return false;
    });
  }
  if (window.esbootstrap_options) {
    $.extend(opts, esbootstrap_options);
  }
  if ((eea_mapping.highlights !== undefined) && (eea_mapping.highlights.enabled)){
    opts.highlight_enabled = eea_mapping.highlights.enabled;
    opts.highlight_whitelist = eea_mapping.highlights.whitelist;
    opts.highlight_blacklist = eea_mapping.highlights.blacklist;
  }
  eea_facetview('.facet-view-simple', opts);
});


function limitString() {
  $.each($('.tileItem > .tileBody'), function(index, value) {
    description = $(value).text();
    $(value).text(description.slice(0, 700) + '...');
  });
}

function getChartTree(matchSubcategory = false) {
    var results = $.fn.facetview.options.data.records;
    var response = {'name':'','children':[]};
    var categories = new Array();
    if (matchSubcategory) {
        subCategories = [];
    }
    for (i=0;i<results.length;i++) {
        [response, categories, catPosition] = populateChart(response, categories,results[i].typeOfData);
        if (matchSubcategory) {
            if(typeof subCategories[catPosition] === 'undefined') {
                subCategories[catPosition] = [];
            }
            if ('string' == typeof(results[i].spatial)) {
                [response, subCategories[catPosition], subCatPosition] = populateChart(response, subCategories[catPosition],results[i].spatial, catPosition);
            } else {
                for (iSubCat=0;iSubCat<results[i].spatial.length;iSubCat++) {
                    [response, subCategories[catPosition], subCatPosition] = populateChart(response, subCategories[catPosition],results[i].spatial[iSubCat], catPosition);
                }
            }
        }
        if (matchSubcategory) {
            if ('string' == typeof(results[i].spatial)) {
                var subCatPosition = subCategories[catPosition].indexOf(results[i].spatial);
                response.push({'id':response.length, 'name':results[i].title, 'parent':subCatPosition});
            } else {
                for (iSubCat=0;iSubCat<results[i].spatial.length;iSubCat++) {
                    var subCatPosition = subCategories[catPosition].indexOf(results[i].spatial[iSubCat]);
                    response.push({'id':response.length, 'name':results[i].title, 'parent':subCatPosition});
                }
            }
        } else {
            response.children[catPosition].children.push({'name':results[i].title});
        }
    }
    return response;
}


function populateChart(response, categories, current, parent = 0) {
    var catPosition = categories.indexOf(current);
    if (catPosition<0) {
        categories[categories.length] = current;
        catPosition = categories.length-1;
        response.children.push({'name':current ,'children':[]});
    }
    return [response, categories, catPosition];
}

function showChart(divId, dataArray) {
    const width = 700;
    const height = 700;
    const x = 20
    const y = 20
    const radius = width / 2;
    const tree = d3.cluster().size([2 * Math.PI, Math.abs(radius - 100)]);

    var jsonString = '';

    jsonString = JSON.stringify(dataArray);
    const data = JSON.parse(jsonString);

console.log(dataArray);
    const root = tree(d3.hierarchy(data).sort((a, b) => d3.ascending(a.name, b.name)));

    const svg = d3
        .select('#'+divId)
        .append("svg")
        .call(d3.zoom().on("zoom", function () {
           svg.attr("transform", d3.event.transform)
        }))
      .attr("viewBox", [-width/2, -height/2, width + x, height + y])
      //.attr("viewBox", [-100, -400, width + x, height + y])
      ;

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y));

    svg.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
        .attr("transform", d => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0)
        `)
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .attr("transform", d => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y},0)
          rotate(${d.x >= Math.PI ? 180 : 0})
        `)
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke", "white");
}
