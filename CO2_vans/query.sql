Select
    CONCAT(ID, Status, year) as uid,
    concat(year,iif(status='F','-09','-03'),'-1') as date,
    ID,
    MS,
    Mp,
    VFN,
    Mh,
    Man,
    MMS,
    TAN,
    T,
    Va,
    Ve,
    Mk,
    Cn,
    Ct,
    Cr,
    "m (kg)",
    "Mt (kg)",
    "Enedc (g/km)",
    "Ewltp (g/km)",
    "W (mm)",
    "At1 (mm)",
    "At2 (mm)",
    "Ft",
    "Fm",
    "ec (cm3)",
    "ep (KW)",
    "z (Wh/km)",
    It,
    "Ernedc (g/km)",
    "Erwltp (g/km)",
    "De",
    "Vf",
    "r",
    "year",
    "Status",
    "version_file",
    iif (LOWER(TRIM(ft))='ng-biomethane', 'ng', 
        iif(LOWER(TRIM(ft))='petrol-electric', 'petrol/electric', 
            iif(LOWER(TRIM(ft))='diesel-electric', 'diesel/electric',
                iif(LOWER(TRIM(ft))='hybrid/petrol/e', 'petrol', 
                    iif(LOWER(TRIM(ft))='petrol phev', 'petrol/electric', 
                        iif(LOWER(TRIM(ft))='unknown', 'other', 
                            iif(LOWER(TRIM(ft))='ng_biomethane', 'ng', 
                                iif(LOWER(TRIM(ft))='petrol-gas', 'ng', 
                                    iif(LOWER(TRIM(ft))='cng', 'ng', LOWER(TRIM(ft)))
                                )
                            )
                        )
                    )
                )
            )
        )
    ) as FtTrim,
    iif(LOWER(TRIM(status))='f', 'Final', 'Provisional') as scStatus,
    "Mb (kg)",
    "TPMLM (kg)",
    "Dam (kg)",
    "Mf (kg)"
from
    <TABLE>
WHERE
    MS!='M1' and
    ID>=<MIN_ID> and
    ID<<MAX_ID>
order by uid
