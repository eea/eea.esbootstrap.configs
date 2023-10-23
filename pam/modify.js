const { indexOf } = require('underscore');

module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

    try{
      if (doc["Country"] === "Czech Republic"){
        modified_doc['Country'] = "Czechia"
      }
    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }

    fields = [
      'GHG_s__affected',
      'Sector_s__affected',
      'Objective_s_',
      'Type_of_policy_instrument',
      'Status_of_implementation',
      'Entities_responsible_for_implementing_the_policy__type_',
      'Is_the_policy_or_measure_related_to_a_Union_policy_',
      'Related_Union_Policy',
      'Projection_scenario_in_which_the_policy_or_measure_is_included',
      'Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions_GHG',
      'Relevant_union_dimensions_affected'
    ]

    for (let i = 0; i < fields.length; i++){
      if (doc[fields[i]] == undefined) {
        modified_doc[fields[i]] = 'No information';
      }
    }
    if (modified_doc['Entities_responsible_for_implementing_the_policy__type_'].slice(-1) == ';'){
      modified_doc['Entities_responsible_for_implementing_the_policy__type_'] = modified_doc['Entities_responsible_for_implementing_the_policy__type_'].slice(0,-1)
    }
    modified_doc['Entities_responsible_for_implementing_the_policy__type_'] = modified_doc['Entities_responsible_for_implementing_the_policy__type_'].split('/').map(function(item) {
      return item.trim();
    }).join('/');
    modified_doc['Entities_responsible_for_implementing_the_policy__type_'] = modified_doc['Entities_responsible_for_implementing_the_policy__type_'].split(';').map(function(item) {
      return item.trim();
    }).join('; ');
    return modified_doc;
}
