descr_values = {
  "D1":"Biodiversity",
  "D2":"NIS",
  "D3":"Commercial fish",
  "D4":"food webs",
  "D5":"Eutrophication",
  "D6":"Sea floor integrity",
  "D7":"Hydrographical alteration",
  "D8":"Contaminants",
  "D9":"Contaminants in seafood",
  "D10":"Marine litter",
  "D11":"Introduction of energy"
}
module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

//console.log(modified_doc)
    try{
      var descriptors = [];
      for (var i = 1; i < 12; i++){
        if (modified_doc['D' + i] !== 0){
          descriptors.push(descr_values['D' + i]);
        }
      }
      modified_doc['Descriptors'] = descriptors.join(', ');

      if (modified_doc['Sector'] === 'Ports and Traffic'){
        modified_doc['Sector'] = 'Ports and traffic';
      }

      if (modified_doc['Use or activity'] === 'not specified'){
        modified_doc['Use or activity'] = 'Not specified';
      }

      if (modified_doc['Status'] === 'not specified'){
        modified_doc['Status'] = 'Not specified';
      }

      if (modified_doc['Spatial scope'] === 'not specified'){
        modified_doc['Spatial scope'] = 'Not specified';
      }

      if (modified_doc['Measure impacts to'] === 'Nos specified'){
        modified_doc['Measure impacts to'] = 'Not specified';
      }

      if (modified_doc['Nature of the measure'] === 'awareness raising, technical measure'){
        modified_doc['Nature of the measure'] = 'awareness raising, technical measures';
      }

      if (modified_doc['Nature of the measure'] === 'technical measure'){
        modified_doc['Nature of the measure'] = 'technical measures';
      }


    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
//console.log(modified_doc)
    return modified_doc;
}
