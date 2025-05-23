import requests
import json


fields = [
"m__kg_",
"Mt",
"Ewltp__g_km_",
"ec__cm3_",
"ep__KW_",
"z__Wh_km_",
"Erwltp__g_km_",
"r",
"year",
"Zr",
"Fc",
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
  r = requests.get('<endpoint>', auth=('user', 'password'),verify=False, json=query)
  try:
    rr = json.loads(r.text)
    val = int(rr['aggregations']['sum_tmp']['value'])
    print(f"|{field}|{val}|")
  except:
    print(r.text)
