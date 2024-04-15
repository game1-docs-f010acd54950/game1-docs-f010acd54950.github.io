function ApiClient(){

  var apiBaseUrl = getLocationBasePath();
  var database = new loki('database.db');
  var settings;

  this.init = async () => {
    await this.loadDatabase();
    await this.loadSettings();
    console.log(settings);
  }

  function parseIniString(data){
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line){
        if(regex.comment.test(line)){
            return;
        }else if(regex.param.test(line)){
            var match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        };
    });
    return value;
}


  this.loadSettings = async() => {
    console.log("Loading settings");

    var iniResponse = await fetch('./settings.ini');
    try{
      initialSettings = parseIniString(await iniResponse.text());
      settings = {
        ...initialSettings,
        getProperty: function(key) {
          try {
              return key.split(".").reduce((result, key) => {
                  return result[key]
              }, this);
          } catch (err) {
              console.log(key + " cannot be retrieved from settings")
          }
        },
        hasProperty: function(key) {
          try {
              var value = key.split(".").reduce((result, key) => {
                  return result[key]
              }, this);
              return (typeof value !== 'undefined')
          } catch (err) {
              return false;
          }
        }         
      }



    }catch(err){
      console.error("Failed while ./settings.ini was being reading")
      console.error(err)
      settings = {};
    }
  }

  this.loadDatabase = () => {
    console.log("Loading database");
    return new Promise(function(resolve, reject) {
      $.getJSON("./database.json", function(data) {
        database.loadJSONObject(data);
        resolve()
      }).fail(function() {
        console.log("An error has occurred.");
        reject();
      });
    });
  }

  this.getSettings = () => {
    return settings;
  }

  this.findAll = () => {
    return new Promise(function(resolve, reject) {
      resolve(database.getCollection('documents').data);
    });
  };

  this.findDocumentByPath = (path) => {
    return new Promise(function(resolve, reject) {
      var query = [
        {
          "path": path
        }
      ]

      var documents = database.getCollection('documents');
      var results = documents.find({
        $and: query
      });
      resolve(results)
    });
  };

  this.findDocumentByText = (text) => {
    return new Promise(function(resolve, reject) {
      var queryCollection = [
        {
          "text": {
            "$regex": [text,"i"]
          }
        }
      ];
      var documents = database.getCollection('documents');
      var results = documents.find({
        $and: queryCollection
      });
      resolve(results);
    });
  };


  /**
  * Add a URL parameter
  * @param {string} url
  * @param {string} param the key to set
  * @param {string} value
  */
  function addParam(url, param, value) {
     param = encodeURIComponent(param);
     var a = document.createElement('a');
     param += (value ? "=" + encodeURIComponent(value) : "");
     a.href = url;
     a.search += (a.search ? "&" : "") + param;
     return a.href;
  }

  function getLocationBasePath() {

    if (typeof window === "undefined") {
      console.error("ReferenceError: window is not defined. Are you in frontend javascript layer?");
      return;
    }

    if (typeof window.location === "undefined") {
      console.error("ReferenceError: window.location is not defined. Are you in frontend javascript layer?");
      return;
    }

    if(window.location.port){
      return window.location.protocol+"//"+window.location.hostname+":"+window.location.port
    }else {
      return window.location.protocol+"//"+window.location.hostname
    }
  }

}

if(typeof window._context === 'undefined'){
   window._context = {};
}
window._context["ApiClient"] =  new ApiClient();
