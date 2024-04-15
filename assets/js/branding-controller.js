function BrandingController(){

  this.apiClient = window._context["ApiClient"];

  this.init = () => {
    console.log("Customizing...");
    var settings = this.apiClient.getSettings();
    if(settings.hasProperty("branding.logo_type")){      
      if(settings.hasProperty("branding.logo_value")){
        if(settings.getProperty("branding.logo_type") === "text"){
          $('#sidebar-header').prepend('<h1>'+settings.getProperty("branding.logo_value")+'</h1>');
        }else if(settings.getProperty("branding.logo_type") === "image_from_url"){
          $('#sidebar-header').prepend('<img src="'+settings.getProperty("branding.logo_value")+'" alt="logo" class="app-logo">')
        }
      }    
    }else{
      $('#sidebar-header').prepend('<img src="./assets/img/bootstraper-logo.png" alt="logo" class="app-logo">')      
    }

    if(settings.hasProperty("branding.web_title")){
      document.title = settings.getProperty("branding.web_title");
    }
  }

}

if(typeof window._context === 'undefined'){
   window._context = {};
}
window._context["BrandingController"] =  new BrandingController();
