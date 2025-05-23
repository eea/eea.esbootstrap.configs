import requests
import json


fields = [
"MS",
"Mp",
"VFN",
"Mh",
"Man",
"TAN",
"T",
"Va",
"Ve",
"Mk",
"Cn",
"Ct",
"Cr",
"Ft",
"Fm",
"It",
"ech.keyword",
"RLFI.keyword",
]

for field in fields:
  query = {
    "runtime_mappings": {
      "len_tmp": {
        "type": "double",
        "script": {
          "source": f"emit(doc['{field}'].size() > 0 ?doc['{field}'].value.length() :0)"
        }
      }
    },
    "aggs": {
      "sum_len_tmp": {
        "sum": {
          "field": "len_tmp"
        }
      }
    },
    "size": 0
  }
  r = requests.get('<endpoint>', auth=('user', 'password'),verify=False, json=query)

  try:
    rr = json.loads(r.text)
    value= int(rr['aggregations']['sum_len_tmp']['value'])
    print(f"|{field}|{val}|")
  except:
    print(r.text)
    import pdb; pdb.set_trace()
