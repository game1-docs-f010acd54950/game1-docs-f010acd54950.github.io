function MarkdownConverter(){

  this.apiClient = window._context["ApiClient"];

  var markdownConverter = window.markdownit({
    html: true
  });  

  this.render = (markdownString) => {
    var settings = this.apiClient.getSettings();
    if(settings.hasProperty("variables")){ 
      var variables = settings.getProperty("variables");
      for(var key in variables){
        var regex = new RegExp(`{{${key}}}`, 'g');
        markdownString = markdownString.replace(regex, variables[key]);
      }
    }
    return markdownConverter.render(markdownString)
  };
  
}

if(typeof window._context === 'undefined'){
   window._context = {};
}
window._context["MarkdownConverter"] =  new MarkdownConverter();
