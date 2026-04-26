import os
import pickle
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model

model_cache = None
artifacts_cache = None

def load_artifacts():
    global artifacts_cache
    if artifacts_cache is None:
        try:
            with open('models/preprocessing.pkl', 'rb') as f:
                artifacts_cache = pickle.load(f)
        except Exception as e:
            print("Error loading preprocessing artifacts:", e)
            return None
    return artifacts_cache

def load_model_file(model_type):
    """
    Dynamically load the requested model from disk.
    """
    try:
        if model_type == "CNN-LSTM":
             return load_model('models/ids_cnn_lstm.keras')
        elif model_type == "Neural Networks":
             return load_model('models/ids_nn.keras')
        else:
             import joblib
             model_slug = model_type.replace(" ", "_").lower()
             return joblib.load(f'models/ids_{model_slug}.pkl')
    except Exception as e:
        print(f"Error loading model {model_type}:", e)
        return None

def predict_features(features_list, model_type="CNN-LSTM"):
    """
    Run prediction on arbitrary incoming features using the specified model.
    """
    artifacts = load_artifacts()
    model = load_model_file(model_type)
    
    if not artifacts or not model:
        # Dummy fallback response if models not trained yet
        return [{"class": "Normal", "confidence": 0.99} for _ in features_list]
        
    scaler = artifacts['scaler']
    label_enc = artifacts['label_encoder']
    expected_cols = artifacts['features']
    seq_len = artifacts['seq_len']

    # Convert to DataFrame
    df = pd.DataFrame(features_list)
    
    # Missing columns padding
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0
            
    df = df[expected_cols]

    # Scaling
    X_scaled = scaler.transform(df)

    if model_type == "CNN-LSTM":
        # In raw API calls usually predicting 1 packet requires looking backwards
        # If len(X_scaled) < seq_len, we pad
        if len(X_scaled) < seq_len:
             pad = np.zeros((seq_len - len(X_scaled), X_scaled.shape[1]))
             X_scaled = np.vstack([pad, X_scaled])
             
        # Take the last sequence snippet to predict the 'current' packet
        curr_seq = X_scaled[-seq_len:]
        curr_seq = np.expand_dims(curr_seq, axis=0) # shape (1, seq_len, features)

        preds = model.predict(curr_seq, verbose=0)
        pred_class_idx = np.argmax(preds, axis=1)[0]
        confidence = float(np.max(preds, axis=1)[0])
    else:
        # Classical models take raw rows
        # We take the most recent row if multiple provided, or run on all?
        # For Sandbox we usually check 1 record.
        X_final = X_scaled[-1:] if len(X_scaled) > 0 else X_scaled
        
        if hasattr(model, 'predict_proba'):
            probs = model.predict_proba(X_final)
            pred_class_idx = np.argmax(probs, axis=1)[0]
            confidence = float(np.max(probs, axis=1)[0])
        else:
            pred_class_idx = model.predict(X_final)[0]
            confidence = 1.0

    class_name = label_enc.inverse_transform([pred_class_idx])[0]
    
    return [{"class": class_name, "confidence": confidence}]
