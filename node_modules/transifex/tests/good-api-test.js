var should = require('should');
var nock = require('nock');
var Transifex = require('../transifex');

transifex = new Transifex({
  project_slug: "node-transifex-sample",
  credential: "test.transifex:TestForTransifex"
});

describe("Project API", function () {

  it("The projectInstanceMethods function should return details in JSON format", function (done) {
    should(function(){
      transifex.projectInstanceMethods("transifex", function(err, data) {
        data.should.have.properties('long_description', 'homepage', 'teams', 'organization', 'source_language_code');
        done();
      });
    }).not.throw();
  });

});

describe("Resource API", function () {
  afterEach(function() {
    nock.cleanAll();
  });

  it("The resourceCreateMethod function posts and returns JSON", function (done) {
    should(function(){
      nock("https://www.transifex.com")
        .post("/api/2/project/transifex/resources/")
        .reply(201, '[0, 1, 0]');

      var form = {
        slug: 'test',
        name: 'test',
        i18n_type: 'KEYVALUEJSON',
        content: JSON.stringify({"hello world": "hello world"}),
      };
      transifex.resourceCreateMethod("transifex", form, function(err, data) {
        should.ifError(err);
        data.should.not.be.empty;
        done();
      });
    }).not.throw();
  });

  it("The resourceDeleteMethod function returns no content", function (done) {
    should(function(){

      nock("https://www.transifex.com")
        .delete("/api/2/project/transifex/resource/test/?details")
        .reply(204);

      transifex.resourceDeleteMethod("transifex", "test", function(err, data) {
        data.should.be.empty;
        done();
      });
    }).not.throw();
  });

  it("The resourcesSetMethod function returns JSON-encoded list with details", function (done) {
    should(function(){
      transifex.resourcesSetMethod("transifex", function(err, data) {
        data.should.match(function(it) { return it[0].should.have.properties('name'); });
        done();
      });
    }).not.throw();
  });

  it("The resourcesInstanceMethods function with option false", function (done) {
    should(function(){
      transifex.resourcesInstanceMethods("node-transifex-sample", "source-file", false, function(err, data) {
        data.should.have.properties('name', 'i18n_type', 'categories', 'slug', 'priority');
        done();
      });
    }).not.throw();
  });

  it("The resourcesInstanceMethods function with option true", function (done) {
    should(function(){
      transifex.resourcesInstanceMethods("node-transifex-sample", "source-file", true, function(err, data) {
        data.should.have.properties('name', 'i18n_type', 'categories', 'slug', 'priority', 'available_languages');
        done();
      });
    }).not.throw();
  });

  it("The sourceLanguageMethods function should return content of the translation file", function (done) {
    should(function(){
      transifex.sourceLanguageMethods("node-transifex-sample", "source-file", function(err, data) {
        data.should.not.be.empty;
        done();
      });
    }).not.throw();
  });

  it("The uploadSourceLanguageMethod function puts source message", function (done) {
    should(function(){
      nock("https://www.transifex.com")
        .put("/api/2/project/transifex/resource/sample/content/")
        .reply(201, {
           "strings_added": 0,
           "strings_updated": 0,
           "strings_delete": 0,
           "redirect": "/transifex/transifex/sample/"
      });

      var form = {
        content: JSON.stringify({"hello world": "hello world"}),
      };
      transifex.uploadSourceLanguageMethod("transifex", "sample", form, function(err, data) {
        should.ifError(err);
        data.should.have.properties('strings_added', 'strings_updated', 'strings_delete', 'redirect');
        done();
      });
    }).not.throw();
  });

});

describe("Language API", function () {

  it("The languageSetMethod function returns a JSON encoded list with the fields language_code, coordinators, translators and reviewers.", function (done) {
    should(function(){
      transifex.languageSetMethod("node-transifex-sample", function(err, data) {
        data.should.match(function(it) { return it[0].should.have.properties('language_code', 'translators', 'reviewers'); });
        done();
      });
    }).not.throw();
  });

  it("languageInstanceMethod function returns JSON encoded string with option false", function (done) {
    should(function(){
      transifex.languageInstanceMethod("node-transifex-sample", "de", false, function(err, data) {
        data.should.have.properties('coordinators', 'translators', 'reviewers');
        done();
      });
    }).not.throw();
  });

  it("languageInstanceMethod function returns JSON encoded string with option true", function (done) {
    should(function(){
      transifex.languageInstanceMethod("node-transifex-sample", "de", true, function(err, data) {
        data.should.have.properties('coordinators', 'translators', 'reviewers', 'total_segments', 'untranslated_segments');
        done();
      });
    }).not.throw();
  });

  it("contributorListFor coordinators", function (done) {
    should(function(){
      transifex.contributorListFor("node-transifex-sample", "de", "coordinators", function(err, data) {
        data.should.have.property('coordinators').and.containDeep([])
        done();
      });
    }).not.throw();
  });

 it("contributorListFor reviewers", function (done) {
   should(function(){
     transifex.contributorListFor("node-transifex-sample", "de", "reviewers", function(err, data) {
      data.should.have.property('reviewers').and.containDeep([])
       done();
     });
   }).not.throw();
 });

 it("contributorListFor translators", function (done) {
   should(function(){
     transifex.contributorListFor("node-transifex-sample", "de", "translators", function(err, data) {
      data.should.have.property('translators').and.containDeep([])
       done();
     });
   }).not.throw();
 });

it("listOfContributors function should return list of array with all contributors", function (done) {
  should(function(){
    transifex.listOfContributors(function(err, data) {
      data.should.be.instanceOf(Array);
      done();
    });
  }).not.throw();
});

});

describe("Translations API", function () {
  afterEach(function() {
    nock.cleanAll();
  });

  it("translationInstanceMethod with no option", function (done) {
    should(function(){
      transifex.translationInstanceMethod("node-transifex-sample", "source-file", "de", function(err, data, type) {
        data.should.not.be.empty;
        type.should.not.be.empty;
        done();
      });
    }).not.throw();
  });

  it("translationInstanceMethod default mode", function (done) {
    should(function(){
      transifex.translationInstanceMethod("node-transifex-sample", "source-file", "de", { mode: "default" }, function(err, data, type) {
        data.should.not.be.empty;
        type.should.not.be.empty;
        done();
      });
    }).not.throw();
  });

  it("translationInstanceMethod reviewed mode", function (done) {
    should(function(){
    transifex.translationInstanceMethod("node-transifex-sample", "source-file", "de", { mode: "default" }, function(err, data, type) {
      data.should.not.be.empty;
      type.should.not.be.empty;
      done();
     });
    }).not.throw();
  });

  it("translationInstanceMethod translator mode", function (done) {
    should(function(){
      transifex.translationInstanceMethod("node-transifex-sample", "source-file", "de", { mode: "default" }, function(err, data, type) {
        data.should.not.be.empty;
        type.should.not.be.empty;
        done();
      });
    }).not.throw();
  });

  it("translationStringsMethod", function (done) {
    should(function(){
      transifex.translationStringsMethod("node-transifex-sample", "source-file", "de", "test", function(err, data) {
        try {
          data = JSON.parse(data);
          data[0].should.have.properties('comment', 'context', 'tags', 'source_string', 'translation', 'last_update');
        } catch(e) {
          done();
        }
        done();
      });
    }).not.throw();
  });

  it("translationStringsMethod specific string", function (done) {
    should(function(){
      transifex.translationStringsMethod("node-transifex-sample", "source-file", "de", "This is cool. Super Cool!", function(err, data) {
        try {
          data = JSON.parse(data);
          data[0].should.have.properties('comment', 'context', 'tags', 'source_string', 'translation', 'last_update');
          data.length.should.be.equal(1);
          data[0].translation.should.be.equal("Das ist cool. Super cool!");
        } catch(e) {
          done();
        }
        done();
      });
    }).not.throw();
  });

  it("translationStringsPutMethod specific string", function (done) {
    should(function(){
      const content = [{ key: "This is cool. Super Cool!", translation: "Das ist cool. Super cool!"}];
      nock("https://www.transifex.com")
        .put("/api/2/project/node-transifex-sample/resource/source-file/translation/de/strings/")
        .reply(201, content);

      transifex.translationStringsPutMethod("node-transifex-sample", "source-file", "de", content, function(err, data) {
        try {
          data = JSON.parse(data);
          data.length.should.be.equal(1);
          data[0].translation.should.be.equal("Das ist cool. Super cool!");
        } catch(e) {
          console.log(e);
          done();
        }
        done();
      });
    }).not.throw();
  });

  it("The uploadTranslationInstanceMethod function puts translation content", function (done) {
    should(function(){
      nock("https://www.transifex.com")
        .put("/api/2/project/transifex/resource/sample/translation/es/?file")
        .reply(201, {
           "strings_added": 1,
           "strings_updated": 0,
           "strings_delete": 0,
           "redirect": "/transifex/transifex/sample/"
      });

      var content = {
        slug: 'sample',
        name: 'sample',
        i18n_type: 'KEYVALUEJSON',
        content: JSON.stringify({"hello world": "hello world"}),
      };

      transifex.uploadTranslationInstanceMethod("transifex", "sample", "es", content, function(err, data) {
        parsedData = JSON.parse(data);
        parsedData.should.have.properties('strings_added', 'strings_updated', 'strings_delete', 'redirect');
        done();
      });
    }).not.throw();
  });

});

describe("Statistics API", function () {

  it("statisticsMethods with language code", function (done) {
    should(function(){
      transifex.statisticsMethods("node-transifex-sample", "source-file", "de", function(err, data) {
        data.should.have.properties('reviewed_percentage', 'completed', 'untranslated_words', 'last_commiter', 'reviewed', 'untranslated_entities');
        done();
      });
    }).not.throw();
  });

  it("statisticsMethods without language code", function (done) {
    should(function(){
      transifex.statisticsMethods("node-transifex-sample", "source-file", function(err, data) {
        data['de'].should.have.properties('reviewed_percentage', 'completed', 'untranslated_words', 'last_commiter', 'reviewed', 'untranslated_entities');
        data['pt_BR'].should.have.properties('reviewed_percentage', 'completed', 'untranslated_words', 'last_commiter', 'reviewed', 'untranslated_entities');
        done();
      });
    }).not.throw();
  });

  it("languageStatisticsMethods", function (done) {
    should(function(){
      transifex.languageStatisticsMethods("de", function(err, data) {
        data['source-file'].should.have.properties('reviewed_percentage', 'completed', 'untranslated_words', 'last_commiter', 'reviewed', 'untranslated_entities');
        done();
      });
    }).not.throw();
  });

  it("projectStatisticsMethods", function (done) {
    should(function(){
      transifex.projectStatisticsMethods(function(err, data) {
        data['source-file']['de'].should.have.properties('reviewed_percentage', 'completed', 'untranslated_words', 'last_commiter', 'reviewed', 'untranslated_entities');
        done();
      });
    }).not.throw();
  });

});

describe("Language Info API", function () {

  it("The languageInstanceMethods function returns the fields name, code, nplurals and pluralequation for the language associated with the specified code in JSON format.", function (done) {
    should(function(){
      transifex.languageInstanceMethods("th_TH", function(err, data) {
        data.should.have.property("name", "Thai (Thailand)");
        data.should.eql({  rtl: false, pluralequation: "language.pluralequation", code: "th_TH", name: "Thai (Thailand)", nplurals: 1});
        done();
      });
    }).not.throw();
  });

  it("The languageSetMethods function returns the fields name, code, nplurals and pluralequation for all languages supported by Transifex in JSON format.", function (done) {
    should(function(){
      transifex.languageSetMethods(function(err, data) {
        data[0].should.have.properties('pluralequation', 'code', 'name');
        done();
      });
    }).not.throw();
  });

  it("The languageSetInfoMethods function returns the field name and code for all languages available in the project.", function (done) {
    should(function(){
      transifex.languageSetInfoMethods(function(err, data) {
        data[0].should.have.properties('locale', 'name');
        done();
      });
    }).not.throw();
  });

});
