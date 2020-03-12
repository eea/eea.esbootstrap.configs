#!/usr/bin/env python
import sys
import csv
import xml.etree.ElementTree as ET


def main(csv_input, csv_output, base_url, conversion_id, source):
    reader = csv.DictReader(csv_input)

    rows = [row for row in reader]


    rows2 = []


    for row in rows:
        cfrom = row['YEAR_DATA_COLLECTION_START']
        cto =  row['YEAR_DATA_COLLECTION_END']
        try:
            cfrom = int(cfrom)
            cto = int(cto)
#            import pdb; pdb.set_trace();
            row['COLLECTIONS_RANGE'] = ", ".join([str(x) for x in range(cfrom, cto + 1)])
#            crange = ""

        except:
            pass

    fieldnames = reader.fieldnames
    fieldnames.append('COLLECTIONS_RANGE')

    if 1:
        writer = csv.DictWriter(csv_output, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Add report ID column')
    parser.add_argument('-i', '--input-csv', help='CSV input file', type=argparse.FileType('rU'),
                        default=sys.stdin)
    parser.add_argument('-o', '--output-csv', help='CSV output file', type=argparse.FileType('wb'),
                        default=sys.stdout)
    parser.add_argument('-u', '--base-url', help='',
                        default='http://cdr.eionet.europa.eu/Converters/run_conversion?file=')
    parser.add_argument('-c', '--conversion-id', help='', default='524')
    parser.add_argument('-s', '--source', help='', default='remote')
    args = parser.parse_args(sys.argv[1:])
    main(
        csv_input=args.input_csv,
        csv_output=args.output_csv,
        base_url=args.base_url,     
        conversion_id=args.conversion_id,
        source=args.source,
    )
