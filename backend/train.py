import os
from data_layer import load_dataset
from preprocess import preprocess_data, make_sequences
from model import build_cnn_lstm, build_baseline_nn, get_classical_model
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import joblib
import numpy as np
import json
import time

def train_model(model_type, dataset_path=None):
    print(f"Loading data to train {model_type}...")
    df = load_dataset(dataset_path)
    
    # Downsample huge datasets to prevent web frontend UI timeouts during long HTTP training blocks
    if df is not None and len(df) > 25000 and (model_type == "CNN-LSTM" or model_type == "Neural Networks"):
        df = df.head(min(25000, len(df)))

    is_sequential = (model_type == "CNN-LSTM")
    X_train, X_test, y_train, y_test, num_classes = preprocess_data(df, shuffle=(not is_sequential))

    metrics_res = {}

    if model_type == "CNN-LSTM":
        X_train_seq, y_train_seq = make_sequences(X_train, y_train)
        X_test_seq, y_test_seq = make_sequences(X_test, y_test)

        # Shuffle sequences instead of raw rows
        indices = np.arange(len(X_train_seq))
        np.random.shuffle(indices)
        X_train_seq, y_train_seq = X_train_seq[indices], y_train_seq[indices]

        input_shape = (X_train_seq.shape[1], X_train_seq.shape[2])
        model = build_cnn_lstm(input_shape, num_classes)

        es = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
        mc = ModelCheckpoint('models/best_model_cnn_lstm.keras', save_best_only=True)

        print("Training CNN-LSTM...")
        history = model.fit(
            X_train_seq, y_train_seq, 
            validation_data=(X_test_seq, y_test_seq),
            epochs=20, 
            batch_size=64, 
            callbacks=[es, mc],
            verbose=1
        )

        model.save('models/ids_cnn_lstm.keras')

        y_pred = np.argmax(model.predict(X_test_seq), axis=1)
        metrics_res = calc_metrics(y_test_seq, y_pred)
        metrics_res['history'] = {
            "loss": history.history['loss'],
            "val_loss": history.history['val_loss'],
            "accuracy": history.history['accuracy'],
            "val_accuracy": history.history['val_accuracy']
        }

    elif model_type == "Neural Networks":
        model = build_baseline_nn(X_train.shape[1], num_classes)
        es = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
        mc = ModelCheckpoint('models/best_model_nn.keras', save_best_only=True)

        history = model.fit(
            X_train, y_train, 
            validation_data=(X_test, y_test),
            epochs=10, 
            batch_size=64, 
            callbacks=[es, mc],
            verbose=0
        )
        model.save('models/ids_nn.keras')

        y_pred = np.argmax(model.predict(X_test), axis=1)
        metrics_res = calc_metrics(y_test, y_pred)

    else:
        # Classical Models
        model = get_classical_model(model_type)
        print(f"Training {model_type}...")
        model.fit(X_train, y_train)

        # Save model
        joblib.dump(model, f'models/ids_{model_type.replace(" ", "_").lower()}.pkl')
        
        y_pred = model.predict(X_test)
        metrics_res = calc_metrics(y_test, y_pred)

    # Save results to metrics.json
    metrics_path = 'models/metrics.json'
    all_metrics = {}
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, 'r') as f:
                all_metrics = json.load(f)
        except:
            pass
            
    all_metrics[model_type] = {
        "accuracy": float(metrics_res["accuracy"]),
        "precision": float(metrics_res["precision"]),
        "recall": float(metrics_res["recall"]),
        "f1": float(metrics_res["f1_score"]),
        "timestamp": time.time()
    }
    
    with open(metrics_path, 'w') as f:
        json.dump(all_metrics, f, indent=4)

    return metrics_res

def calc_metrics(y_true, y_pred):
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(y_true, y_pred, average='weighted', zero_division=0),
        "recall": recall_score(y_true, y_pred, average='weighted', zero_division=0),
        "f1_score": f1_score(y_true, y_pred, average='weighted', zero_division=0),
    }

if __name__ == "__main__":
    train_model("CNN-LSTM")
