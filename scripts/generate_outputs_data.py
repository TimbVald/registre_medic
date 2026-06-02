import pandas as pd
import json
import os

outputs_dir = 'D:/Mes Projets/WebSite/clinique/clinique-master/Data_Analysis/outputs'
out_file = 'D:/Mes Projets/WebSite/clinique/clinique-master/src/app/analyse/outputsData.ts'

def safe_float(v):
    if pd.isna(v): return None
    try:
        if isinstance(v, str):
            v = v.replace(',', '.')
        return float(v)
    except:
        return v

# Tableau 1: Descriptif
df1 = pd.read_csv(os.path.join(outputs_dir, 'resultats_analyse_ces(Tableau_1_Descriptif).csv'), sep=';')
df1 = df1.where(pd.notnull(df1), None)
descriptif = df1.to_dict(orient='records')

# Tableau 2: Bivarie
df2 = pd.read_csv(os.path.join(outputs_dir, 'resultats_analyse_ces(Tableau_2_Bivarie).csv'), sep=';')
df2 = df2.where(pd.notnull(df2), None)
bivarie = []
for row in df2.to_dict(orient='records'):
    row['p_value_float'] = safe_float(row.get('p_value'))
    bivarie.append(row)

# Tableau 3: Multivarie
df3 = pd.read_csv(os.path.join(outputs_dir, 'resultats_analyse_ces(Tableau_3_Multivarie).csv'), sep=';')
df3 = df3.where(pd.notnull(df3), None)
multivarie = []
for row in df3.to_dict(orient='records'):
    row['ORa_float'] = safe_float(row.get('ORa'))
    row['RRa_float'] = safe_float(row.get('RRa'))
    row['p_value_float'] = safe_float(row.get('p_value'))
    row['IC95_inf_float'] = safe_float(row.get('IC95_inf'))
    row['IC95_sup_float'] = safe_float(row.get('IC95_sup'))
    multivarie.append(row)

final_data = {
    "descriptif": descriptif,
    "bivarie": bivarie,
    "multivarie": multivarie
}

with open(out_file, 'w', encoding='utf-8') as f:
    f.write('export const outputsData = ' + json.dumps(final_data, ensure_ascii=False, indent=2) + ';\n')

print('Outputs data successfully exported to outputsData.ts')
