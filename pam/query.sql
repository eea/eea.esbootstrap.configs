select iif(isnull(Average_expost_emission_reduction__kt_CO2eq_y_GHG, 'No') = 'No', 'No', 'Yes') as Average_expost_emission_reduction__kt_CO2eq_y_GHG_BOOL,
       iif(isnull(cast(Expost_production_ktoe_year_RES as varchar), 'No') = 'No', 'No', 'Yes') as Expost_production_ktoe_year_RES_BOOL,
       iif(isnull(cast(Expost_reductions_ktoe_year_final_energy_EE as varchar), 'No') = 'No', 'No', 'Yes') as Expost_reductions_ktoe_year_final_energy_EE_BOOL,
       Objective_s_ as Objective_s__lookup_only4facets,
       concat('https://discomap.eea.europa.eu/map/GHG_PAMS/',Country,'.pdf') as pdf,
* from <TABLE>
