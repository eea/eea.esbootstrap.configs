import requests
import json

ENDPOINT=""
USER=""
PASSWORD=""

fields = [
"r",
"m__kg_",
"Mt__kg_",
"Mb__kg_",
"TPMLM__kg_",
"Mf__kg_",
"Ewltp__g_km_",
"ec__cm3_",
"ep__KW_",
"z__Wh_km_",
"Erwltp__g_km_",
"Zr",
"Fc",
"CO2mon",
"CO2",
"Mmon",
"MRObaseI",
"MRObaseC",
]

for field in fields:
  query = {
    "runtime_mappings": {
      "integer_tmp": {
        "type": "double",
        "script": {
          "source": f"emit(doc['{field}'].size() > 0 ? Math.round(doc['{field}'].value) : 0)"
        }
      }
    },
    "aggs": {
      "sum_tmp": {
        "sum": {
          "field": "integer_tmp"
        }
      }
    },
    "size": 0
  }
  r = requests.get(ENDPOINT, auth=(USER, PASSWORD),verify=False, json=query)
  try:
    rr = json.loads(r.text)
    val = int(rr['aggregations']['sum_tmp']['value'])
    print(f"|{field}|{val}|")
  except:
    print(r.text)
