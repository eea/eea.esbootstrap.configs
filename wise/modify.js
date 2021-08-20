var CsvReadableStream = require('csv-reader');

descr_values = {
  "D1":"Biodiversity",
  "D2":"NIS",
  "D3":"Commercial fish",
  "D4":"Food webs",
  "D5":"Eutrophication",
  "D6":"Sea floor integrity",
  "D7":"Hydrographical alteration",
  "D8":"Contaminants",
  "D9":"Contaminants in seafood",
  "D10":"Marine litter",
  "D11":"Introduction of energy"
}

function rename_key(doc, old_key, new_key){
  if (old_key !== new_key) {
    doc[new_key] = doc[old_key];
    delete doc[old_key];
  }
  return doc;
}

function normalize_doc(doc){
  let keys = Object.keys(doc)
  for (var i = 1; i < keys.length; i++){
    let old_key = keys[i];
    let new_key = old_key.replace(/[\W_]+?/g,"_");
    doc = rename_key(doc, old_key, new_key)
  }
  return doc;
}


function joinCSV(doc, csv, fields){
  const detectCharacterEncoding = require('detect-character-encoding');
  const fileBuffer = fs.readFileSync(csv);
  const charsetMatch = detectCharacterEncoding(fileBuffer);
  const inputStream = fs.createReadStream(csv, charsetMatch.encoding)
  let stream = inputStream
    .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true , delimiter: ','}));
  stream
    .on('data', function (row) {
      console.log(row)
    }).on('end', function (data) {
      console.log('No more rows!');
    });

}

function joinBD(doc){
  joinCSV(doc, './data/BD.csv', {'key':'MeasureCode','simple_fields':{'Country_code':'c_code','season':'season','Feature code':'f_code'}})
/*Region
Country_code
Season
Feature code
Sub-unit
Pressure code
Pressure name
Pressure type
Pressure location
Ranking
Measure code
Measure type recommended to address E02 and/or E03
measure purpose
Measure location
Measure response
Measure additional info
*/
}

function joinHDH(doc){
/*Region
Country_code
Feature code
Pressure code
Pressure name
Pressure type
Pressure location
Ranking
Measure code
Measure type recommended to address E02 and/or E03
Measure purpose
Measure location
Measure response
Measure additional info
*/
}

function joinHDS(doc){
/*Region
Country_code
Feature code
Pressure code
Pressure name
Pressure type
Pressure location
Ranking
Measure code
Measure type recommended to address E02 and/or E03
measure purpose
Measure location
Measure response
Measure additional info
*/
}

function joinMSFD(doc){
/*Country
Measure Number
Link to existing policies
KTMs it links to
Relevant targets
Descriptors it links to 
Relevant features from MSFD Annex III
Spatial  scope_MSFD
Other (if applicable)
PORTS
SHIPPING
BOTH
accident management
administrative
air pollution
anchoring/mooring
awareness raising
ballast waters
construction
dredging
EU policies
hull fouling
international agreements
legislation/regulation
maintenence
marine litter
navigation
NIS
noise
pollution
regional sea convention
PSSA/ZMES
technical measures
waste management
water pollution
TEST
1
1b (not related to WFD)
1b (related to WFD)
2
2a
2b
unknown
TEST
Status Resume
*/
}

function joinMSPD(doc){
/*MSPD implementation status
Shipping Tackled
Traffic separation scheme
Priority Areas
Approaching Areas
Precautionary areas
Areas to be avoided
Future Scenarios
Source
Keywords
Authority
General View
Ports
Future Expectations
Safety manner
Objective
Categories
*/
}

function joinSEC(doc){
/*IMPACTS Waste management
IMPACTS Air pollution
IMPACTS Marine litter
IMPACTS NIS
IMPACTS Noise
IMPACTS Pollution
IMPACTS Water pollution
IMPACTS Other
Spatial scale
Source(s)
*/
}

function joinWFD(doc){
Nature of physical modification
Effect on hydromorphology
Ecological impacts

]
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

module.exports = function(doc){
    const _ = require('underscore');
    let modified_doc = {}
    modified_doc = _.extend(modified_doc, doc);

//console.log(modified_doc)

    try{
      var descriptors = [];
      var descriptors_flags = [];
      for (var i = 1; i < 12; i++){
        if (modified_doc['D' + i] !== 0){
          descriptors.push(descr_values['D' + i]);
          descriptors_flags.push('D' + i);
        }
      }
      modified_doc['Descriptors'] = descriptors;
      modified_doc['Descriptors_flags'] = descriptors_flags;

      if (modified_doc['Sector'] === 'Ports and Traffic'){
        modified_doc['Sector'] = 'Ports and traffic';
      }

      if (modified_doc['Use or activity'] === 'not specified'){
        modified_doc['Use or activity'] = 'Not specified';
      }

      if ((modified_doc['Status'] === 'not specified') || (modified_doc['Status'] === '')){
        modified_doc['Status'] = 'Not specified';
      }

      if (modified_doc['Status'] === 'ident'){
        modified_doc['Status'] = 'Identified';
      }

      if (modified_doc['Status'] === 'taken'){
        modified_doc['Status'] = 'Taken';
      }

      if (modified_doc['Status'] === 'notident'){
        modified_doc['Status'] = 'Not identified';
      }

      if (modified_doc['Spatial scope'] === 'not specified'){
        modified_doc['Spatial scope'] = 'Not specified';
      }

      if (modified_doc['Measure impacts to'] === 'Nos specified'){
        modified_doc['Measure impacts to'] = 'Not specified';
      }

      let notm = modified_doc['Nature of the measure'].split(", ");
      let notm_list = [];
      for (var i = 0; i < notm.length; i++){
        if (notm[i] === "technical measure"){
          notm[i] = "technical measures"
        }
        notm_list.push(notm[i].capitalize());
      }
      modified_doc['Nature of the measure'] = notm_list;
      modified_doc = normalize_doc(modified_doc);
joinBD(doc);
    }
    catch(err){
        console.log(err);
        console.log("Index the document without modifications");
        modified_doc = doc;
    }
    return modified_doc;
}
