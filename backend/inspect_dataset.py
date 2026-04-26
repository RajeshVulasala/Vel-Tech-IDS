import pandas as pd
import os

upload_dir = 'uploads'
files = os.listdir(upload_dir)
if files:
    path = os.path.join(upload_dir, files[0])
    df = pd.read_csv(path)
    df.columns = df.columns.str.strip()
    print("Columns:", df.columns.tolist())
    possible_targets = ['label', 'Label', 'class', 'Class', 'attack', 'attack_type']
    target_col = next((col for col in possible_targets if col in df.columns), None)
    if target_col:
        print(f"Target Column: {target_col}")
        print("Value Counts:\n", df[target_col].value_counts())
    else:
        print("Target column not found!")
else:
    print("No files found in uploads")
