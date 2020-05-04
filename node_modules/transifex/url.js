module.exports = function ( projectName ) {
  const BASE_URL = "https://www.transifex.com/api/2/";
  const BASEP_URL = BASE_URL + "project/";
  const projectUrl = BASEP_URL + projectName + "/";
  const prSlug = BASEP_URL + "<project_slug>/resource/<resource_slug>/";
  const plSlug = BASEP_URL + "<project_slug>/language/<language_code>/";
  const translationUrlBase = prSlug + "translation/<language_code>/";

  var API = {
    projectInstanceAPI: BASEP_URL + "<project_slug>/?details",
    projectResources: BASEP_URL + "<project_slug>/resources/",
    projectResource: prSlug + "?details",
    projectResourceContent: prSlug + "content/",
    projectResourceFile: prSlug + "content/?file",
    languageSetURL: BASEP_URL + "<project_slug>/languages/",
    languageInstanceURL: plSlug + "?details",
    contributorForURL: plSlug + "<type>/",
    translationUrlBase: prSlug + "translation/<language_code>/",
    translationMethodURL:  translationUrlBase + "?file",
    translationStringsPutURL: translationUrlBase + "strings/",
    translationStringsURL: translationUrlBase + "strings/?details<string_key>",
    statsMethodURL: prSlug + "stats/<language_code>/",
    languageURL: BASE_URL + "language/<language_code>/",
    languagesURL: BASE_URL + "languages/",
    txProjects: BASE_URL + "projects/",
    projectDetailsAPIUrl: projectUrl + "?details"
  };

  return {
    API: API
  };
};
