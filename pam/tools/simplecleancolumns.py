#!/usr/bin/env python
import sys
import csv
import xml.etree.ElementTree as ET

responsible_entities = {
    'Government': 'National government',
    'Local': 'Local government',
    'Regional': 'Regional entities',
    'Companies': 'Companies/business/industrial association',
    'Research': 'Research institutions',
    'Other': 'Other',
    'No information': 'No information'
}

def main(csv_input, csv_output):
    reader = csv.DictReader(csv_input)
    rows = [row for row in reader]
    erfi_clean = "Entities_responsible_for_implementing_the_policy__type__clean"
    for row in rows:
        soi = row.get('Status_of_implementation', '')
        ips = row.get('Implementation_period_start', '')
        psi = row.get('Projection_scenario_in_which_the_policy_or_measure_is_included', '')
        ipr = row.get('Is_the_policy_or_measure_related_to_a_Union policy_', '') or row.get('Is_the_policy_or_measure_related_to_a_Union_policy_', '')
        upl = row.get('Union_policy_lookup_only4facets', '') or row.get('Union_policies_lookup_only4facets', '')
        erfi = row.get('Entities_responsible_for_implementing_the_policy__type_','')

        soi_clean = "No information"
        ips_clean = "No information"
        psi_clean = "No information"
        ipr_clean = "No information"
        upl_clean = "No information"

        if len(soi) > 0:
          soi_clean = soi[:1].upper() + soi[1:]
          soi_clean = soi_clean.strip()

        if len(ips) > 0:
          ips_clean = ips

        if len(psi) > 0:
          psi_clean = psi
          if psi_clean == 'NIP':
              psi_clean = 'Not included in a projection scenario'

        if len(ipr) > 0:
            ipr_clean = ipr

        if len(upl) > 0:
            if upl != 'UNDEFINED':
                upl_clean = upl

        row['Status_of_implementation'] = soi.strip()
        row['Status_of_implementation_clean'] = soi_clean
        row['Implementation_period_start_clean'] = ips_clean
        row['Projection_scenario_in_which_the_policy_or_measure_is_included_clean'] = psi_clean
        row['Is_the_policy_or_measure_related_to_a_Union_policy__clean'] = ipr_clean
        row['Union_policy_lookup_only4facets_clean'] = upl_clean

        pie = "Policy_impacting_EU_ETS__ESD_or_LULUCF_emissions"
        row[pie] = ", ".join(row[pie].split(","))
        if row[pie] == 'UNDEFINED':
            row[pie] = "No information"

        topi = "Type_of_policy_instrument"
        row[topi] = ", ".join(row[topi].split(","))

        sa = "Sector_s__affected"
        row[sa] = "; ".join(row[sa].split(","))
        row[sa] = ", ".join(row[sa].split(";  "))
        os = "Objective_s__lookup_only4facets"
        row[os] = "; ".join(row[os].split(","))
        row[os] = ", ".join(row[os].split(";  "))

        erfi = "Entities_responsible_for_implementing_the_policy__type_"
        row[erfi] = ", ".join(row[erfi].split(","))
        if row[erfi].strip() == '':
            row[erfi] = "No information"
        if row[erfi].strip() == 'Undefined':
            row[erfi] = "No information"

        ghg = "GHG_s__affected"
        row[ghg] = ", ".join(row[ghg].split(","))

        uplc = "Union_policy_lookup_only4facets_clean"
        row[uplc] = "; ".join(row[uplc].split(";"))
        if row[uplc].strip()[-1:] == ";":
            row[uplc] = row[uplc].strip()[:-1]

        rup = "Related_Union_Policy"
        if row[rup].strip() == 'UNDEFINED':
            row[rup] = "No information"

        row[erfi_clean] = ', '.join([responsible_entities[v.strip()] for v in row[erfi].split(',')])

    fieldnames = reader.fieldnames
    fieldnames.append('Status_of_implementation_clean')
    fieldnames.append('Implementation_period_start_clean')
    fieldnames.append('Projection_scenario_in_which_the_policy_or_measure_is_included_clean')
    fieldnames.append('Is_the_policy_or_measure_related_to_a_Union_policy__clean')
    fieldnames.append('Union_policy_lookup_only4facets_clean')
    fieldnames.append(erfi_clean)
    if 1:
        writer = csv.DictWriter(csv_output, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Clean columns')
    parser.add_argument('-i', '--input-csv', help='CSV input file', type=argparse.FileType('rU'),
                        default=sys.stdin)
    parser.add_argument('-o', '--output-csv', help='CSV output file', type=argparse.FileType('wb'),
                        default=sys.stdout)
    args = parser.parse_args(sys.argv[1:])
    main(
        csv_input=args.input_csv,
        csv_output=args.output_csv
    )
