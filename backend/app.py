import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from data_layer import load_dataset
from train import train_model
from preprocess import preprocess_data, preprocess_preview
from inference import predict_features
from live_capture import start_capture, stop_capture, get_live_stats
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('models', exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/api/dataset/upload', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = secure_filename(file.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(path)
        try:
            df = load_dataset(path)
            stats = {
                "filename": filename,
                "rows": len(df),
                "columns": len(df.columns),
                "features": list(df.columns)
            }
            return jsonify({"status": "Dataset uploaded and loaded successfully", "stats": stats})
        except Exception as e:
             return jsonify({"error": str(e)}), 500

@app.route('/api/dataset/preprocess', methods=['GET'])
def run_preprocess_preview():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    if not files:
        return jsonify({"error": "No dataset uploaded"}), 400
    
    path = os.path.join(app.config['UPLOAD_FOLDER'], files[0])
    try:
        df = load_dataset(path)
        raw, processed = preprocess_preview(df)
        return jsonify({
            "status": "complete",
            "raw": raw,
            "processed": processed
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models/train', methods=['POST'])
def run_training():
    data = request.json
    model_type = data.get("model_type", "CNN-LSTM")
    dataset_path = data.get("dataset_path")
    
    if not dataset_path:
        # Check if there is an uploaded file, fallback to dummy
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        if len(files) > 0:
            dataset_path = os.path.join(app.config['UPLOAD_FOLDER'], files[0])
            
    try:
        metrics = train_model(model_type, dataset_path)
        return jsonify({"status": "training complete", "metrics": metrics})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models/evaluate', methods=['POST'])
def evaluate_model():
    # Placeholder for model evaluation
    return jsonify({
        "accuracy": 0.95,
        "precision": 0.94,
        "recall": 0.96,
        "f1_score": 0.95
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    features = data.get("features", [])
    if not features:
        return jsonify({"error": "No features provided"}), 400
        
    try:
         model_type = data.get("model_type", "CNN-LSTM")
         predictions = predict_features(features, model_type)
         return jsonify({"predictions": predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/live/start', methods=['POST'])
def api_start_capture():
    interface = request.json.get("interface", None)
    result = start_capture(interface)
    return jsonify(result)

@app.route('/api/live/stop', methods=['POST'])
def api_stop_capture():
    result = stop_capture()
    return jsonify(result)

@app.route('/api/live/stats', methods=['GET'])
def api_get_stats():
    stats = get_live_stats()
    return jsonify(stats)

@app.route('/api/models', methods=['GET'])
def list_models():
    models_dir = 'models'
    if not os.path.exists(models_dir):
        return jsonify([])
    
    files = os.listdir(models_dir)
    model_files = [f for f in files if f.endswith('.keras') or f.endswith('.pkl')]
    return jsonify(model_files)

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    path = 'models/metrics.json'
    if os.path.exists(path):
        with open(path, 'r') as f:
            return jsonify(json.load(f))
    return jsonify({})

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Model count
    models_dir = 'models'
    model_count = 0
    if os.path.exists(models_dir):
        model_count = len([f for f in os.listdir(models_dir) if f.endswith('.keras') or f.endswith('.pkl')])
    
    # Live stats
    live = get_live_stats()
    total_packets = live.get("total_packets", 0)
    
    # Calculate threats from last packets
    threats = 0
    for p in live.get("last_packets", []):
        if p.get("prediction", "Normal") != "Normal":
            threats += 1
            
    return jsonify({
        "active_models": model_count,
        "processed_packets": total_packets,
        "threats_detected": threats,
        "system_load": "24%",
        "history": live.get("history", [])
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Vel Tech IDS API is running"})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
