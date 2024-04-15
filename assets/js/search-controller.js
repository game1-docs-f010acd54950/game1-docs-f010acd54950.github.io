function SearchController() {

  var apiClient = window._context["ApiClient"];
  var menuController = window._context["MenuController"];

  var searchInput;

  this.init = async () => {
    searchInput = $('#search_input');
    searchInput.keyup(this.onKeyUp);
  };

  this.onResultRowClick = async (ev) => {
    var documentPath = ev.currentTarget.getAttribute("path");
    await menuController.renderPageFromPath(documentPath);
  }

  this.onKeyUp = async (ev) => {
    var textToSearch = searchInput.val();
    if(textToSearch.length <3){
      return
    }

    var results = await apiClient.findDocumentByText(textToSearch);

    if(results.length == 0){
      return
    }

    $("#rigthPreview").empty();

    var content = '<table id="search_results" style="width: 100%; display: inline-table" >'
    for(i=0; i<results.length; i++){
      if(results[i].path=="/root.md") continue;
      var title = results[i].title || results[i].path
      content += `<tr style="cursor: pointer;" path=${results[i].path} ><td> ${title} </td></tr>`;
    }
    content += "</table>"

    $('#rigthPreview').append(content);

    $('#search_results').on('click', 'tr', this.onResultRowClick);
  }

}

if (typeof window._context === 'undefined') {
  window._context = {};
}
window._context["SearchController"] = new SearchController();
