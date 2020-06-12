function sanitize_csv(field, separator){
    let values = field.split(separator);
    let clean_values = [];
    for (let i = 0; i < values.length; i++){
        let clean_value = values[i].trim();
        if (clean_value.length > 0){
            clean_values.push(clean_value)
        }
    }
    return clean_values.join(separator + " ");
}

module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

    try{
        // create range for period
        if ((!isNaN(modified_doc["Period start"])) && (!isNaN(modified_doc["Period end"]))){
            modified_doc["Period range"] = ""
            for (let i = modified_doc["Period start"]; i <= modified_doc["Period end"]; i++){
                modified_doc["Period range"] += i;
                if (i !== modified_doc["Period end"]){
                    modified_doc["Period range"] += ", ";
                }
            }
        }

        // create publication year that only contains numbers
        if (!isNaN(modified_doc["Publication year"])){
            modified_doc["Publication year for facet"] = modified_doc["Publication year"]
        }

        // remove trailing spaces from csv
        modified_doc["Policy area(s)"] = sanitize_csv(modified_doc["Policy area(s)"], ";");
        modified_doc["Sector(s)"] = sanitize_csv(modified_doc["Sector(s)"], ";");
        modified_doc["Geographical scope"] = sanitize_csv(modified_doc["Geographical scope"], ";");
        modified_doc["Methods - types"] = sanitize_csv(modified_doc["Methods - types"], ";");

    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
    return modified_doc;
}