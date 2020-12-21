function sanitize_csv(field, separator){
    if (!field){
      return;
    }
    let values = field.split(separator);
    let clean_values = [];
    for (let i = 0; i < values.length; i++){
        let clean_value = values[i].trim();
        if (clean_value.length > 0){
            clean_value = clean_value.replace(/^\w/, (c) => c.toUpperCase());
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
        modified_doc._timestamp = undefined;
        // create range for period
        if ((!isNaN(modified_doc["Period_start"])) && (!isNaN(modified_doc["Period_end"]))){
            modified_doc["Period_range"] = ""
            for (let i = modified_doc["Period_start"]; i <= modified_doc["Period_end"]; i++){
                modified_doc["Period_range"] += i;
                if (i !== parseInt(modified_doc["Period_end"])){
                    modified_doc["Period_range"] += ", ";
                }
            }
        }
        // create publication year that only contains numbers
        if (!isNaN(modified_doc["Publication_year"])){
            modified_doc["Publication_year_for_facet"] = modified_doc["Publication_year"]
        }


        // remove trailing spaces from csv
//        modified_doc["Policy area - main"] = sanitize_csv(modified_doc["Policy area - main"], ";");
//        modified_doc["Sector(s)"] = sanitize_csv(modified_doc["Sector(s)"], ";");
        modified_doc["Geographical_scope"] = sanitize_csv(modified_doc["Geographical_scope"], ";");
//        modified_doc["Geographical_scope_only_for_facets"] = modified_doc["Geographical_scope"];
//        modified_doc["Methods - types"] = sanitize_csv(modified_doc["Methods - types"], ";");
//        modified_doc["Methods"] = sanitize_csv(modified_doc["Methods"], ";");
//console.log("METHODS:",modified_doc["Methods"]);
    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
    return modified_doc;
}
