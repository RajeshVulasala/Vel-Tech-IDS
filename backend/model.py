import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, LSTM, Dense, Dropout, BatchNormalization
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier

def build_cnn_lstm(input_shape, num_classes):
    """
    Builds the CNN-LSTM Hybrid Model architecture.
    """
    model = Sequential([
        Conv1D(64, kernel_size=3, activation='relu', padding='same', input_shape=input_shape),
        BatchNormalization(),
        MaxPooling1D(pool_size=2),
        Dropout(0.3),
        LSTM(128, dropout=0.3, recurrent_dropout=0.1),
        Dense(64, activation='relu'),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

def build_baseline_nn(input_dim, num_classes):
    """
    Builds a Baseline Neural Network.
    """
    model = Sequential([
        Dense(128, activation='relu', input_shape=(input_dim,)),
        Dropout(0.3),
        Dense(64, activation='relu'),
        Dense(num_classes, activation='softmax')
    ])
    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

def get_classical_model(model_name):
    if model_name == "Logistic Regression":
        return LogisticRegression(max_iter=1000)
    elif model_name == "Random Forest":
        return RandomForestClassifier(n_estimators=100)
    elif model_name == "Decision Tree":
        return DecisionTreeClassifier()
    else:
        raise ValueError("Unsupported Classical Model")
