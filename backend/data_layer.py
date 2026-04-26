import pandas as pd
import numpy as np

def load_dataset(filepath):
    """
    Loads dataset from filepath. Supports CSV.
    """
    if filepath and filepath.endswith('.csv'):
        df = pd.read_csv(filepath)
        return df
    elif filepath is None:
        return None
    else:
        raise ValueError("Unsupported File format")

def create_dummy_data(n_samples=1000, n_features=41):
    """
    Creates dummy network traffic data if no dataset is provided.
    """
    X = np.random.rand(n_samples, n_features)
    y = np.random.choice(['Normal', 'DoS', 'Probe', 'R2L', 'U2R'], size=n_samples, p=[0.7, 0.15, 0.1, 0.03, 0.02])
    
    columns = [f"feature_{i}" for i in range(n_features)]
    df = pd.DataFrame(X, columns=columns)
    df['label'] = y
    return df
