# Steps to be executed before importing csv in semantic#

1. Open the xls file in excel/opneoffice and rename all columns to not contain special characters. Replace the special characters with _, and save it as csv
Characters to be replaced are: , - ( ) / “ ” ?
2. Execute the addreportid.py script, to build the reportid column based on the "Link to national report" column
3. Execute the simplecleancolumns.py script for normalizing some values, and to exclude some specific values from facets.

Scripts are usable with stdin/stderr:

```
cat /tmp/PaMs-Viewer-Flat-file-final_v2.1.csv | ./addreportid.py  | ./simplecleancolumns_v2.py
```
