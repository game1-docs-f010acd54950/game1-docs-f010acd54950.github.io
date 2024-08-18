function FragmentController() {

  var apiClient;
  var markdownConverter;

  this.init = () => {

    markdownConverter = window._context["MarkdownConverter"];
    apiClient = window._context["ApiClient"];

    this.addListener();
    this.renderAtheStartup();
  }

  this.renderAtheStartup = () =>{
    if(window.location.hash==""){
      this.renderPageFromPath("/root.md")
      return;
    }

    var documentPath = window.location.hash.substring(1).replace(/%20/g, " ");
    console.log(`Go to ${documentPath}`);
    
    // Create the event
    var event = new CustomEvent("render-page", {
      "detail": documentPath
    });

    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event);
  }

  this.addListener = () => {
    document.addEventListener("render-page", this.renderPageFromEvent);
  };

  this.renderPageFromEvent = (event) => {
    console.log("rendering page:"+event.detail);
    this.renderPageFromPath(event.detail);
  }

  this.renderPageFromPath = async (documentPath) => {
    if (typeof documentPath === "undefined") {
      console.log(`document path is undefined.`);
      return;
    }

    var documentPathParts = documentPath.split("?");
    var pagePath = documentPathParts[0].replace(/%20/g, " ");
    var section = documentPathParts[1];

    var document = await apiClient.findDocumentByPath(pagePath);
    if (typeof document === 'undefined' || document.length === 0 || typeof document[0].text === 'undefined') {
      return;
    }
    var html = markdownConverter.render(document[0].text);
    html = html.replace(/<h2>/g,"<h2 style='cursor:pointer'>");
    html = html.replace(/<\/h2>/g, "<img class='permalink_icon' src='/assets/img/permalink-icon.png' /></h2>");

    $("#rigthPreview").html(html);

    $('h2').hover(function(event){
      try{
        $(event.target.childNodes[1]).css('display','inline-block');
      }catch(e){
        console.log(e)
      }
    }, function(event){
      try{
        $(event.currentTarget.childNodes[1]).css('display','none');        
      }catch(e){
        console.log(e)
      }
    });    

    if(section!=null){
      var sectionReference = $("h2:contains('"+section+"')");
      if(sectionReference!=null){
        window.scrollTo(window.scrollX, sectionReference.offset().top);
        sectionReference.effect("highlight", {}, 10000);
      }
    }

    
    $('h2').click(function(event){
      try{
        window.location.hash = window.location.hash.substring(1).split("?")[0]+"?"+event.target.innerText
        // Copy the text inside the text field
        navigator.clipboard.writeText(window.location.href);
      }catch(e){
        console.log(e)
      }
    });

    //add the fragment
    if(pagePath!="/root.md"){
      if(section!=null){
        window.location.hash = pagePath.replace(/\s/g, "%20")+"?"+section;
      }else{
        window.location.hash = pagePath.replace(/\s/g, "%20");
      }
    }
    
  }  

}

if (typeof window._context === 'undefined') {
  window._context = {};
}
window._context["FragmentController"] = new FragmentController();
