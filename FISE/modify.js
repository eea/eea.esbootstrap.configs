module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

    try{
        // create range for period
        if ((!isNaN(modified_doc["YEAR_DATA_COLLECTION_START"])) && (!isNaN(modified_doc["YEAR_DATA_COLLECTION_END"]))){
            modified_doc["COLLECTIONS_RANGE"] = ""
            for (let i = modified_doc["YEAR_DATA_COLLECTION_START"]; i <= modified_doc["YEAR_DATA_COLLECTION_END"]; i++){
                modified_doc["COLLECTIONS_RANGE"] += i;
                if (i !== modified_doc["YEAR_DATA_COLLECTION_END"]){
                    modified_doc["COLLECTIONS_RANGE"] += ", ";
                }
            }
        }
    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
    return modified_doc;
}