function AppEntryPoint(){
  var menuController = window._context["MenuController"];
  var sidebarController = window._context["SidebarController"];
  var searchController = window._context["SearchController"];
  var fragmentController = window._context["FragmentController"];
  var apiClient = window._context["ApiClient"];

  this.init = async() => {
    await apiClient.init()    
    sidebarController.init();
    searchController.init();
    fragmentController.init();
    menuController.init();
  }

  $( document ).ready(()=> {
      this.init();
  });

}

if(typeof window._context === 'undefined'){
   window._context = {};
}
window._context["AppEntryPoint"] = new AppEntryPoint();
