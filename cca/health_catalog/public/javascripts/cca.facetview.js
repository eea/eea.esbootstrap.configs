//window.search_text_input_clear = true;
jQuery(document).ready(function($) {
  if (window.settings_display_images === undefined){
    settings_display_images = true;
  }
  var opts = {
    search_url: './tools/api',
    search_index: 'elasticsearch',
    datatype: 'json',
    initial_search: false,
    search_text_input_clear: true,
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
      updatePagination();
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
  function updatePagination() {
      $('.facetview_top').css("display", "block");
      $('.top-pagination').css("display", "block");
      //$('.pagination').css("display", "none");
  }
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
      showArticle(pathName);
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

function showArticle(pathName) {
  $.get(pathName+'?only_article=1', function(data) {
    if ($('#facetview_article_content').length == 0) {
        $( "#facetview_rightcol" ).after("<div id='facetview_article' class='hide row-fluid'><div style='width:100%' class='text-right'><a href='' style='color:white' class='button-field standard-button primary-button' id='faceview_article_back_to_list'>back to search results</a></div><div id='facetview_article_content'></div></div>");
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");
    $('#facetview_article_content').html(doc.getElementById("content-core"));

    $('.share-your-info-ace-button').addClass('hide');
    $('#facetview_article').removeClass('hide');
    $('#facetview_rightcol').addClass('hide');
  });
}

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
            if (response.children[catPosition].children.length<41) {
                if (response.children[catPosition].children.length<40) {
                    var l = document.createElement("a");
                    l.href = results[i].about;
                    title = results[i].title;
                    //If highlight then title is not a string
                    if (typeof title === 'object' || title instanceof Object) {
                        title = title[0].replace(/(<([^>]+)>)/gi, "").trim();
                    }
                    response.children[catPosition].children.push({'name':title, 'url':l.pathname});
                } else {
                    response.children[catPosition].children.push({'name':'...'});
                }
            }
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
    const maxTitleLength = 40;
    const zoomInDeep = 2;

    box = document.querySelector('#'+divId);
    const width = box.offsetWidth;
    const height = box.offsetWidth;
    const x = 20
    const y = 20
    const radius = width / 2;
    const tree = d3.cluster().size([2 * Math.PI, Math.abs(radius - 100)]);

    var jsonString = JSON.stringify(dataArray);
    const data = JSON.parse(jsonString);

    const root = tree(d3.hierarchy(data).sort((a, b) => d3.ascending(a.name, b.name)));

    colors = [
        'B60505', '08822F', '3538A0', 'B11369', '09AB81'
        ,'000000', '05638C', '8F0238', 'D1A007'
    ];
    for(i=0;i<root.children.length;i++) {
        root.children[i].color = '#'+colors[i];
        for(j=0;j<root.children[i].children.length;j++) {
            root.children[i].children[j].color = '#'+colors[i];
        }
    }

    const svg = d3
        .select('#'+divId)
        .append("svg")
        .call(d3.zoom().on("zoom", function () {
           svg.attr("transform", d3.event.transform)
        }))
      .attr("viewBox", [-width/2, -height/2, width + x, height + y])
      //.attr("viewBox", [-100, -400, width + x, height + y])
      ;

    //Lines
    svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
        .attr('stroke', function(data) {
            var node = data.source;
            return node.parent ? node.color : '#ddd';
        })
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y/zoomInDeep));

    //Circle for articles
    svg.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
        .style("cursor", function(data) {
            if(data.data.url) {
                return 'pointer';
            }
        })
        .on('click', function(d, i) {
          if (!d.data.url) {
              return false;
          }
          showArticle(d.data.url+'?only_article=1');
        })
        .attr("transform", d => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y/zoomInDeep},0)
        `)
        .attr("fill", d => d.color)
        .attr("r", 2.5);

    //Text nodes
    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)

      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("cursor", function(data) {
            if(data.data.url) {
                return 'pointer';
            }
        })
        .on('click', function(d, i) {
          if (!d.data.url) {
              return false;
          }
          //debugger;
          $.get(d.data.url+'?only_article=1', function(data) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            $('#facetview_article_content').html(doc.getElementById("content-core"));

            $('.share-your-info-ace-button').addClass('hide');
            $('#facetview_article').removeClass('hide');
            $('#facetview_rightcol').addClass('hide');
          });
          // transition the clicked element
          // to have a radius of 20
        })
        /*
        .on({
              "mouseover": function(d) {
                d.select(this).attr("fill", '#ddd');
              },
              "mouseout": function(d) {
                d.select(this).attr("fill", "green");
              }
            })
*/
        .attr("transform", d => `
          rotate(${d.x * 180 / Math.PI - 90})
          translate(${d.y/zoomInDeep},0)
          rotate(${d.x >= Math.PI ? 180 : 0})
        `)

        .attr("dy", "0.31em")
        .attr("fill", d => d.color)
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        //.attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .text(d => d.data.name.length<maxTitleLength ? d.data.name : d.data.name.substring(0,maxTitleLength)+'...')
      .clone(true).lower()
        .attr("stroke", "white");
}
