function MenuController() {

  var markdownConverter;
  var menuEnhancer;
  var menuHtmlGenerator;
  var apiClient;
  var fragmentController;
  
  this.init = async () => {

    markdownConverter = window._context["MarkdownConverter"];
    menuEnhancer = window._context["MenuEnhancer"];
    menuHtmlGenerator = window._context["MenuHtmlGenerator"];
    apiClient = window._context["ApiClient"];
    fragmentController = window._context["FragmentController"];
    
    await this.createMenu();
    this.addListener();
  };

  this.addListener = () => {
    $('#menuContainer').on("click", this.menuItemOnclick);
  };

  this.createMenu = async () => {
    var documents = await apiClient.findAll();
    var enhancedMenu = menuEnhancer.plainLisToNestedList(documents);
    
    var menuString = menuHtmlGenerator.createComplexMenu(enhancedMenu);
    $("#menuContainer").append(menuString)

    const menuElement = document.getElementById('sidebar');
    const menu = new SlideMenu(menuElement, {
      position: "left",
      submenuLinkAfter: ' ⮞',
      backLinkBefore: '⮜ '
    });
    menu.open();
  };

  this.menuItemOnclick = (event) => {
    if (typeof event.target.getAttribute("page-path") === "undefined") {
      console.log(`menu does not have page-path attribute.`);
      return;
    }
    var documentPath = event.target.getAttribute("page-path");
    console.log(`Go to ${documentPath}`);
    event.preventDefault();

    // Create the event
    var event = new CustomEvent("render-page", {
      "detail": documentPath
    });
    console.log(event)
    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event);
  }

}

if (typeof window._context === 'undefined') {
  window._context = {};
}
window._context["MenuController"] = new MenuController();
