module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

    try{
        // create range for period
      modified_doc['code'] = doc['NFR'] + " " + doc['Sector'];
      if (doc['Type'] !== undefined){
        modified_doc['Type'] = doc['Type'].trim().split(" ").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
      }
    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
    return modified_doc;
}
