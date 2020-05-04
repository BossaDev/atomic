const request = require("request"),
    _ = require("lodash"),
    crypto = require('crypto');

function Transifex(options) {
  this.projectSlug = options.project_slug || "webmaker";
  this.userAuth = options.credential || {};
  this.authHeader = "Basic " + new Buffer(this.userAuth).toString("base64");
  this.expUrl = require("./url")(this.projectSlug).API;
};

// request the project details based on the url provided
Transifex.prototype.projectRequest = function(url, options, callback) {
  var fileTypeContent;
  // Allow calling with or without options.
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else {
    callback = callback || function(){};
  }
  request.get({ url: url, qs: options, headers: { "Authorization": this.authHeader } },
    function(error, response, body) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode !== 200) {
      var responseError = new Error(url + " returned " + response.statusCode);
      responseError.response = response;

      return callback(responseError);
    }
    if(response.headers['content-disposition']) {
      var str = response.headers['content-disposition'];
      fileTypeContent = str.substring(str.lastIndexOf(".")).match(/\w+/);
      fileTypeContent = fileTypeContent[0] || null;
    }
    callback(null, body, fileTypeContent);
  });
};

// send data (POST) to project on the url provided
Transifex.prototype.projectPostRequest = function(url, data, callback) {
  var fileTypeContent;
  // Allow calling with or without options.
  callback = callback || function(){};
  request.post({ url: url, body: JSON.stringify(data), headers: { "Authorization": this.authHeader, 'content-type': 'application/json' }},
    function(error, response, body) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode < 200 || response.statusCode > 299) {
      var responseError = new Error(url + " returned " + response.statusCode);
      responseError.response = response;

      return callback(responseError);
    }
    if(response.headers['content-disposition']) {
      var str = response.headers['content-disposition'];
      fileTypeContent = str.substring(str.lastIndexOf(".")).match(/\w+/);
      fileTypeContent = fileTypeContent[0] || null;
    }
    callback(null, body, fileTypeContent);
  });
};

// send DELETE to project on the url provided
Transifex.prototype.projectDeleteRequest = function(url, callback) {
  var fileTypeContent;
  // Allow calling with or without options.
  callback = callback || function(){};
  request.del({ url: url, headers: { "Authorization": this.authHeader }},
    function(error, response, body) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode < 200 || response.statusCode > 299) {
      var responseError = new Error(url + " returned " + response.statusCode);
      responseError.response = response;

      return callback(responseError);
    }
    if(response.headers['content-disposition']) {
      var str = response.headers['content-disposition'];
      fileTypeContent = str.substring(str.lastIndexOf(".")).match(/\w+/);
      fileTypeContent = fileTypeContent[0] || null;
    }
    callback(null, body, fileTypeContent);
  });
};

// send data (PUT) to project on the url provided
Transifex.prototype.projectPutRequest = function(url, data, callback) {
  var fileTypeContent;
  // Allow calling with or without options.
  callback = callback || function(){};
  request.put({ url: url, body: JSON.stringify(data), headers: { "Authorization": this.authHeader, 'content-type': 'application/json' }},
    function(error, response, body) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode < 200 || response.statusCode > 299) {
      var responseError = new Error(url + " returned " + response.statusCode);
      responseError.response = response;

      return callback(responseError);
    }
    if(response.headers['content-disposition']) {
      var str = response.headers['content-disposition'];
      fileTypeContent = str.substring(str.lastIndexOf(".")).match(/\w+/);
      fileTypeContent = fileTypeContent[0] || null;
    }
    callback(null, body, fileTypeContent);
  });
};

Transifex.prototype.projectStatisticsMethods = function(callback) {
  var that = this;
  this.resourcesSetMethod(this.projectSlug, function(error, data) {
    if (error) {
      return callback(error);
    }
    var finalDetails = {},
      wait = data.length;
    _.findKey(data, function(resource) {
      var details = {};
      that.statisticsMethods(this.projectSlug, resource.slug, function(err, projectData){
        if (err) {
          return callback(err);
        }
        details[resource.slug] = projectData;
        _.extend(finalDetails, details);
        wait--;
        if ( wait === 0 ) {
          callback(null, finalDetails);
        }
      });
    });
  });
};

Transifex.prototype.listOfContributors = function(callback) {
  var contributorsDetails = [],
      numOfTranslators = 0,
      numOfReviewers = 0,
      numOfCoordinators = 0,
      totalNum = 0;

  this.languageSetMethod(this.projectSlug, function(err, allListDetails) {
    if (err) {
      return callback(err);
    }
    var contributorLists = [];
    for (var i = allListDetails.length - 1; i >= 0; i--) {
      Object.keys(allListDetails[i]).forEach(function(typeName) {
        if(allListDetails[i][typeName].length >= 0 && typeName != "language_code") {
          for (var x = allListDetails[i][typeName].length - 1; x >= 0; x--) {
            if(contributorLists.indexOf(allListDetails[i][typeName][x]) === -1) {
              contributorLists.push(allListDetails[i][typeName][x]);
            }
          };
        }
      });
    };
    callback( null, contributorLists.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    }));
  });
};

Transifex.prototype.languageSetInfoMethods = function(callback) {
  var that = this;
  this.resourcesSetMethod(this.projectSlug, function (error, resourceData) {
    if (error) {
      return callback(error);
    }
    var languagesInfo = [];
    that.resourcesInstanceMethods(this.projectSlug, resourceData[0].slug, function(err, data) {
      data.available_languages.forEach(function(language) {
        languagesInfo.push({
          locale: language.code,
          name: language.name
        });
      });
      callback(null, languagesInfo)
    })
  });
};

Transifex.prototype.languageStatisticsMethods = function(locale, callback) {
  var that = this;
  this.resourcesSetMethod(this.projectSlug, function(error, projectData) {
    if (error) {
      return callback(error);
    }
    var details = {},
    wait = projectData.length;

    _.findKey(projectData, function(resource) {
      that.statisticsMethods(this.projectSlug, resource.slug, locale, function(err, data) {
        details[resource.slug] = data;
        wait--;
        if ( wait === 0 ) {
          callback(null, details);
        }
      });
    });
  });
};


/*
* PROJECT APIs
*/

Transifex.prototype.projectSetMethods = function(options, callback) {
  this.projectRequest(this.expUrl.txProjects, options, function(err, projects) {
    if (err) {
      return callback(err);
    }
    try {
      projects = JSON.parse(projects);
    } catch (e) {
      return callback(e);
    }
    callback(null, projects);
  });
};

Transifex.prototype.projectInstanceMethods = function(project_slug, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectInstanceAPI.replace("<project_slug>", project_slug);
  this.projectRequest(url, function(err, project) {
    if (err) {
      return callback(err);
    }
    try {
      project = JSON.parse(project);
    } catch (e) {
      return callback(e);
    }
    callback(null, project);
  });
};

/*
* END PROJECT APIs
*/


/*
* RESOURCE API
*/

Transifex.prototype.resourceCreateMethod = function(project_slug, form, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResources.replace("<project_slug>", project_slug);
  this.projectPostRequest(url, form, function(err, resources) {
    if (err) {
      return callback(err);
    }
    try {
      resources = JSON.parse(resources);
    } catch (e) {
      return callback(e);
    }
    callback(null, resources);
  });
};

Transifex.prototype.resourceDeleteMethod = function(project_slug, resource_slug, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  resource_slug = resource_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResource.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug);
  this.projectDeleteRequest(url, function(err, fileContent) {
    if (err) {
      return callback(err);
    }
    callback(null, fileContent);
  });
};

Transifex.prototype.resourcesSetMethod = function(project_slug, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResources.replace("<project_slug>", project_slug);
  this.projectRequest(url, function(err, resources) {
    if (err) {
      return callback(err);
    }
    try {
      resources = JSON.parse(resources);
    } catch (e) {
      return callback(e);
    }
    callback(null, resources);
  });
};

Transifex.prototype.resourcesInstanceMethods = function(project_slug, resource_slug, bool, callback) {
  // Allow calling with or without options.
  if (typeof bool === 'function') {
    callback = bool;
    options = true;
  } else {
    callback = callback || function(){};
  }
  project_slug = project_slug || this.projectSlug || "webmaker";
  resource_slug = resource_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResource.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug);
  if (!bool) {
    url = url.substr(0, url.lastIndexOf("/"))
  }
  this.projectRequest(url, function(err, resource) {
    if (err) {
      return callback(err);
    }
    try {
      resource = JSON.parse(resource);
    } catch (e) {
      return callback(e);
    }
    callback(null, resource);
  });
};

Transifex.prototype.sourceLanguageMethods = function(project_slug, resource_slug, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  resource_slug = resource_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResourceFile.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug);
  this.projectRequest(url, function(err, fileContent) {
    if (err) {
      return callback(err);
    }
    callback(null, fileContent);
  });
};

Transifex.prototype.uploadSourceLanguageMethod = function(project_slug, resource_slug, content, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  resource_slug = resource_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.projectResourceContent.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug);
  this.projectPutRequest(url, content, function(err, status) {
    if (err) {
      return callback(err);
    }
    try {
      status = JSON.parse(status);
    } catch (e) {
      return callback(e);
    }
    callback(null, status);
  });
};

/*
* END RESOURCE API
*/

/*
* LANGUAGE API
*/

Transifex.prototype.languageSetMethod = function(project_slug, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.languageSetURL.replace("<project_slug>", project_slug);
  this.projectRequest(url, function(err, languages) {
    if (err) {
      return callback(err);
    }
    try {
      languages = JSON.parse(languages);
    } catch (e) {
      return callback(e);
    }
    callback(null, languages);
  });
};

Transifex.prototype.languageInstanceMethod = function(project_slug, language_code, bool, callback) {
  // Allow calling with or without options.
  if (typeof bool === 'function') {
    callback = bool;
    bool = true;
  } else {
    callback = callback || function(){};
  }
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.languageInstanceURL.replace("<project_slug>", project_slug)
  .replace("<language_code>", language_code);
  if (!bool) {
    url = url.substr(0, url.lastIndexOf("/"))
  }
  this.projectRequest(url, function(err, language) {
    if (err) {
      return callback(err);
    }
    try {
      language = JSON.parse(language);
    } catch (e) {
      return callback(e);
    }
    if(bool) {
      language.completed_percentage = Math.round(language.translated_segments * 100 / language.total_segments);
    }
    callback(null, language);
  });
};

Transifex.prototype.contributorListFor = function(project_slug, language_code, type, callback) {
  if(["coordinators", "reviewers", "translators"].indexOf(type) === -1) {
    return callback(Error('Please specify the type of the contributor : "coordinators", "reviewers" or "translators"'));
  }
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.contributorForURL.replace("<project_slug>", project_slug)
  .replace("<language_code>", language_code).replace("<type>", type);
  this.projectRequest(url, function(err, list) {
    if (err) {
      return callback(err);
    }
    try {
      list = JSON.parse(list);
    } catch (e) {
      return callback(e);
    }
    callback(null, list);
  });
};

/*
* END LANGUAGE API
*/


/*
* TRANSLATIONS API
*/

Transifex.prototype.translationInstanceMethod = function(project_slug, resource_slug, language_code, type, callback) {
  // Allow calling with or without options.
  if (typeof type === 'function') {
    callback = type;
    type = {};
  } else {
    callback = callback || function(){};
  }
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.translationMethodURL.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug).replace("<language_code>", language_code);
  this.projectRequest(url, type, function(err, content, type) {
    if (err) {
      return callback(err);
    }
    callback(null, content, type);
  });
};

Transifex.prototype.uploadTranslationInstanceMethod = function(project_slug, resource_slug, language_code, content, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  callback = callback || function(){};
  var url = this.expUrl.translationMethodURL.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug).replace("<language_code>", language_code);
  this.projectPutRequest(url, content, function(err, content) {
    if (err) {
      return callback(err);
    }
    callback(null, content);
  });
};


Transifex.prototype.translationStringsMethod = function(project_slug, resource_slug, language_code, string_key, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  string_key = string_key || '';
  var url = this.expUrl.translationStringsURL.replace("<project_slug>", project_slug)
                                        .replace("<resource_slug>", resource_slug)
                                        .replace("<language_code>", language_code)
                                        .replace("<string_key>", string_key ? "&key=" + string_key : '');
  this.projectRequest(url, function(err, content) {
    if (err) {
      return callback(err);
    }
    callback(null, content);
  });
};

// takes objects with a key property, calculates and returns object with source_entity_hash instead
const keyToHash = translationStringObj => {
  // adding colon, ignoring context use case - https://docs.transifex.com/api/translation-strings#identifying-strings-using-hashes
  translationStringObj.source_entity_hash = crypto.createHash('md5').update(translationStringObj.key + ":").digest("hex");
  delete translationStringObj.key;

  return translationStringObj;
};

Transifex.prototype.translationStringsPutMethod = function(project_slug, resource_slug, language_code, content, callback) {
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.translationStringsPutURL.replace("<project_slug>", project_slug)
                                        .replace("<resource_slug>", resource_slug)
                                        .replace("<language_code>", language_code);
  this.projectPutRequest(url, content.map(keyToHash), function(err, content) {
    if (err) {
      return callback(err);
    }
    callback(null, content);
  });
};
/*
* END TRANSLATIONS API
*/


/*
* STATISTICS API
*/

Transifex.prototype.statisticsMethods = function(project_slug, resource_slug, language_code, callback) {
  // Allow calling with or without options.
  if (typeof language_code === 'function') {
    callback = language_code;
    language_code = "";
  } else {
    callback = callback || function(){};
  }
  project_slug = project_slug || this.projectSlug || "webmaker";
  var url = this.expUrl.statsMethodURL.replace("<project_slug>", project_slug)
  .replace("<resource_slug>", resource_slug).replace("<language_code>", language_code);
  if (!language_code) {
    url = url.substr(0, url.lastIndexOf("/"))
  }
  this.projectRequest(url, function(err, stats) {
    if (err) {
      return callback(err);
    }
    try {
      stats = JSON.parse(stats);
    } catch (e) {
      return callback(e);
    }
    callback(null, stats);
  });
};

/*
* END STATISTICS API
*/


/*
* LANGUAGE INFO API
*/

Transifex.prototype.languageInstanceMethods = function(language_code, callback) {
  var url = this.expUrl.languageURL.replace("<language_code>", language_code);
  this.projectRequest(url, function(err, language) {
    if (err) {
      return callback(err);
    }
    try {
      language = JSON.parse(language);
    } catch (e) {
      return callback(e);
    }
    callback(null, language);
  });
};

Transifex.prototype.languageSetMethods = function(callback) {
  this.projectRequest(this.expUrl.languagesURL, function(err, languages) {
    if (err) {
      return callback(err);
    }
    try {
      languages = JSON.parse(languages);
    } catch (e) {
      return callback(e);
    }
    callback(null, languages);
  });
};

/*
* END LANGUAGE INFO API
*/

module.exports = Transifex;
