/* Add custom js here */
var details_snippets = {
  'Documentation': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="icon format-icon" style="height: 18px; width: auto; fill: white;"><g fill-rule="evenodd"><path d="M7,29 L29,29 L29,7 L7,7 L7,29 Z M5,31 L31,31 L31,5 L5,5 L5,31 Z"></path><path d="M21 17L25 17 25 11 21 11 21 17zM19 19L27 19 27 9 19 9 19 19zM9 11L17 11 17 9 9 9zM9 15L17 15 17 13 9 13zM9 19L17 19 17 17 9 17zM9 23L27 23 27 21 9 21zM9 27L23 27 23 25 9 25z"></path></g></svg>',
  'Database': '<div class="format-icon"></div>',
  'Raster data': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="icon format-icon" style="height: 18px; width: auto; fill: white;"><g fill-rule="evenodd"><path d="M29 15L31 15 31 13 29 13zM25 15L27 15 27 13 25 13zM21 15L23 15 23 13 21 13zM9 15L11 15 11 13 9 13zM17 15L19 15 19 13 17 13zM13 15L15 15 15 13 13 13zM5 15L7 15 7 13 5 13zM5 11L7 11 7 9 5 9zM5 7L7 7 7 5 5 5zM9 7L11 7 11 5 9 5zM17 7L19 7 19 5 17 5zM21 7L23 7 23 5 21 5zM13 7L15 7 15 5 13 5zM25 7L27 7 27 5 25 5zM29 7L31 7 31 5 29 5zM29 11L31 11 31 9 29 9zM29 31L31 31 31 29 29 29zM13 31L15 31 15 29 13 29zM9 31L11 31 11 29 9 29zM25 31L27 31 27 29 25 29zM21 31L23 31 23 29 21 29zM17 31L19 31 19 29 17 29zM5 31L7 31 7 29 5 29zM5 23L7 23 7 21 5 21zM5 27L7 27 7 25 5 25zM5 19L7 19 7 17 5 17zM21 19L23 19 23 17 21 17zM25 19L27 19 27 17 25 17zM13 19L15 19 15 17 13 17zM9 19L11 19 11 17 9 17zM17 19L19 19 19 17 17 17zM29 19L31 19 31 17 29 17zM29 23L31 23 31 21 29 21zM29 27L31 27 31 25 29 25zM9 11L23 11 23 9 9 9zM9 23L27 23 27 21 9 21zM9 27L27 27 27 25 9 25z"></path></g></svg>',
  'Report': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="icon format-icon" style="height: 18px; width: auto; fill: white;"><g fill-rule="evenodd"><path d="M24,31 C20.14,31 17,27.859 17,24 C17,20.141 20.14,17 24,17 C27.86,17 31,20.141 31,24 C31,27.859 27.86,31 24,31 L24,31 Z M7,31 L7,5 L17,5 L17,13 L25,13 L25,15.059 C24.671,15.022 24.338,15 24,15 C19.038,15 15,19.037 15,24 C15,26.826 16.312,29.349 18.356,31 L7,31 Z M19,6.414 L23.586,11 L19,11 L19,6.414 Z M33,24 C33,20.09 30.49,16.764 27,15.525 L27,11.586 L18.414,3 L5,3 L5,33 L25,33 L25,32.941 C29.493,32.442 33,28.625 33,24 L33,24 Z"></path><path d="M25 23L22 23 22 25 23 25 23 27 22 27 22 29 26 29 26 27 25 27zM24 21.5C24.828 21.5 25.5 20.828 25.5 20 25.5 19.172 24.828 18.5 24 18.5 23.172 18.5 22.5 19.172 22.5 20 22.5 20.828 23.172 21.5 24 21.5"></path></g></svg>',
  'Tabular data': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" class="icon format-icon" style="height: 18px; width: auto; fill: white;"><path fill-rule="evenodd" d="M23,17 L29,17 L29,13 L23,13 L23,17 Z M23,29 L29,29 L29,25 L23,25 L23,29 Z M15,29 L21,29 L21,25 L15,25 L15,29 Z M7,29 L13,29 L13,25 L7,25 L7,29 Z M7,17 L13,17 L13,13 L7,13 L7,17 Z M7,11 L13,11 L13,7 L7,7 L7,11 Z M15,17 L21,17 L21,13 L15,13 L15,17 Z M7,23 L13,23 L13,19 L7,19 L7,23 Z M23,23 L29,23 L29,19 L23,19 L23,23 Z M15,23 L21,23 L21,19 L15,19 L15,23 Z M15,11 L21,11 L21,7 L15,7 L15,11 Z M23,11 L29,11 L29,7 L23,7 L23,11 Z M23,5 L13,5 L5,5 L5,13 L5,17 L5,25 L5,31 L13,31 L23,31 L31,31 L31,25 L31,17 L31,13 L31,5 L23,5 Z"></path></svg>'
}

window.jQuery(document).ready(function ($) {
  var formatelem = $(".meta-data").find(".format");
  var format = $(formatelem).text();
  $(details_snippets[format]).insertBefore($(formatelem).parent());


  var downloadIconsClasses = {
    xlsx: "fa-file-excel",
    pdf: "fa-file-pdf",
    PDF: "fa-file-pdf",
    doc: "fa-file-word",
    xls: "fa-file-excel",
    link: "fa-external-link-alt"
  }

  var item = $('.nfi-download-button')
  var downloadArr = $(item).attr('type').split('.')
  var type = downloadArr[downloadArr.length - 1]
  var icon = $(item).find('i.fas')
  icon.addClass(downloadIconsClasses[type])


  let title = $('.resource-title')[0];
  let content_type = $(title.parentElement).find('.content-type')[0].innerHTML;

  icon = "";

  switch (content_type) {
    case "Tabular data":
      icon = "<i class='fas fa-table'></i>&nbsp;";
      break;
    case "Report":
      icon = "<i class='fas fa-chart-line'></i>&nbsp;";
      break;
    case "Data services":
      icon = "<i class='fas fa-cog'></i>&nbsp;";
      break;
    case "Documentation":
      icon = "<i class='fas fa-file'></i>&nbsp;";
      break;
    case "Database":
      icon = "<i class='fas fa-database'></i>&nbsp;";
      break;
    case "Spacial dataset":
      icon = "<i class='fas fa-globe-europe'></i>&nbsp;"
      break;
    case "Others":
      icon = "<i class='fas fa-list'></i>&nbsp;"
      break;
  }

  title.innerHTML = icon + title.innerHTML;
});
