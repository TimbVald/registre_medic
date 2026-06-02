import pandas as pd
import json
import numpy as np

def compute_dossier_complet(df):
    required = [c for c in ('NOM', 'PRENOM', 'DDN', 'SEXE', 'RESIDENCE', 'TYPE_DREP', 'AGE_DECOUV_MOIS', 'ANTEC_FAM') if c in df.columns]
    if not required: return pd.Series([np.nan]*len(df), index=df.index)
    return df[required].notna().all(axis=1).astype(int)

df = pd.read_csv('D:/Mes Projets/WebSite/clinique/clinique-master/Data_Analysis/data/Masque_CES_41patients_comma.csv', encoding='latin1')
df.columns = [str(c).strip() for c in df.columns]

df['patient_id'] = df['ID'].astype(str).str.split('-').str[0]
df = df.replace({'': np.nan, ' ': np.nan, 9: np.nan, '9': np.nan})

df['SEXE_lbl'] = df['SEXE'].map({1.0: 'Masculin', 2.0: 'Féminin'}).fillna('Inconnu')
df['TYPE_lbl'] = df['TYPE_DREP'].map({1.0: 'SS', 2.0: 'SC', 3.0: 'S-β-thal'}).fillna('Inconnu')

df['AGE_ANS'] = pd.to_numeric(df['AGE_ANS'], errors='coerce')
df['AGE_GROUPE'] = pd.cut(df['AGE_ANS'], bins=[-0.1, 4.999, 9.999, 14.999, 200], labels=['0–4 ans', '5–9 ans', '10–14 ans', '15+ ans']).astype(str).replace({'nan': 'Inconnu'})

df['DOSSIER_COMPLET'] = compute_dossier_complet(df)

for c in ['NB_CVO', 'NB_HOSPIT', 'NB_TRANSFUS', 'PERIODE', 'RDV_HONORE', 'VACC_PEV', 'VACC_ANT_PEV', 'AF_PRISE', 'AF_PRISE_ANT']:
    if c in df.columns:
        df[c] = pd.to_numeric(df[c], errors='coerce')

d_cols = [c for c in df.columns if c.startswith('D_')]
for c in d_cols:
    df[c] = pd.to_numeric(df[c], errors='coerce')

keep_cols = ['patient_id', 'PERIODE', 'SEXE_lbl', 'TYPE_lbl', 'AGE_GROUPE', 'DOSSIER_COMPLET', 'RDV_HONORE', 'NB_CVO', 'NB_HOSPIT', 'NB_TRANSFUS', 'VACC_PEV', 'VACC_ANT_PEV', 'AF_PRISE', 'AF_PRISE_ANT'] + d_cols

out_df = df[keep_cols].copy()
out_df = out_df.where(pd.notnull(out_df), None)

records = out_df.to_dict(orient='records')

with open('D:/Mes Projets/WebSite/clinique/clinique-master/src/app/analyse/realData.ts', 'w', encoding='utf-8') as f:
    f.write('export const rawData = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';\n')

print('Data successfully exported to realData.ts')
