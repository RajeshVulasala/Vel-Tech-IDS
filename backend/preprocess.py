import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
import pickle
import os

SEQ_LEN = 10

def preprocess_preview(df):
    """
    Simulates preprocessing to show the user a preview.
    """
    if df is None:
        return None, None
        
    df_clean = df.copy()
    df_clean.columns = df_clean.columns.str.strip()
    
    # Simple clean for preview
    df_clean.replace([np.inf, -np.inf], np.nan, inplace=True)
    df_clean.fillna(df_clean.median(numeric_only=True), inplace=True)
    
    # Take top 5 for preview
    raw_preview = df.head(5).to_dict(orient='records')
    processed_preview = df_clean.head(5).to_dict(orient='records')
    
    return raw_preview, processed_preview

def preprocess_data(df, target_col='label', shuffle=True):
    if df is None:
         from data_layer import create_dummy_data
         df = create_dummy_data()

    # Clean column names (strip spaces, lowercase)
    df.columns = df.columns.str.strip()
    
    # Check for target column
    actual_target = None
    possible_targets = ['label', 'Label', 'class', 'Class', 'attack', 'attack_type']
    for t in possible_targets:
        if t in df.columns:
            actual_target = t
            break
            
    if not actual_target:
        # Fallback to the last column if typical targets aren't found
        actual_target = df.columns[-1]

    # Convert inf, -inf to NaN before filling
    df.replace([np.inf, -np.inf], np.nan, inplace=True)

    # Fill NaNs
    df.fillna(df.median(numeric_only=True), inplace=True)
    
    # Drop duplicates ONLY if shuffling (shuffling implies independence)
    if shuffle:
        df.drop_duplicates(inplace=True)

    # Encode label
    label_enc = LabelEncoder()
    y = label_enc.fit_transform(df[actual_target])
    
    # Identify features
    X = df.drop(columns=[actual_target])
    
    # One-hot encoding for categoricals
    categorical_cols = X.select_dtypes(include=['object']).columns
    if len(categorical_cols) > 0:
        X = pd.get_dummies(X, columns=categorical_cols)

    # Scale numeric
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)

    # Train test split
    if shuffle:
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)
    else:
        # Sequential split for time-series integrity
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, shuffle=False)

    os.makedirs('models', exist_ok=True)
    with open('models/preprocessing.pkl', 'wb') as f:
         pickle.dump({
             "scaler": scaler,
             "label_encoder": label_enc,
             "seq_len": SEQ_LEN,
             "features": X.columns.tolist()
         }, f)

    return X_train, X_test, y_train, y_test, len(np.unique(y))

def make_sequences(X, y, seq_len=SEQ_LEN):
    """
    Creates overlapping sequences for CNN-LSTM models.
    """
    seqs_X, seqs_y = [], []
    for i in range(len(X) - seq_len):
        seqs_X.append(X[i:i+seq_len])
        seqs_y.append(y[i+seq_len])
    return np.array(seqs_X), np.array(seqs_y)
