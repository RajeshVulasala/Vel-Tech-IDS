import requests
import time

API_URL = "http://127.0.0.1:5000/api"

def test_everything():
    results = {}
    print("Testing Health...")
    try:
        res = requests.get(f"{API_URL}/health").json()
        results['Health'] = "Pass" if res.get('status') == 'ok' else "Fail"
    except Exception as e:
        results['Health'] = f"Fail: {e}"

    print("Testing Dataset Upload (No File)...")
    try:
        res = requests.post(f"{API_URL}/dataset/upload")
        results['Upload (Validation)'] = "Pass" if res.status_code == 400 else "Fail"
    except Exception as e:
        results['Upload (Validation)'] = f"Fail: {e}"

    print("Testing Model Training (CNN-LSTM)...")
    try:
        res = requests.post(f"{API_URL}/models/train", json={"model_type": "CNN-LSTM"})
        results['Training (CNN-LSTM)'] = "Pass" if res.status_code == 200 else f"Fail: {res.text}"
    except Exception as e:
        results['Training (CNN-LSTM)'] = f"Fail: {e}"

    print("Testing Live Packet Capture Start...")
    try:
        res = requests.post(f"{API_URL}/live/start", json={"interface": "eth0"})
        results['Live Start'] = "Pass" if res.status_code == 200 else f"Fail: {res.text}"
    except Exception as e:
        results['Live Start'] = f"Fail: {e}"

    print("Gathering Live Stats...")
    try:
        time.sleep(1.5) # Wait for some packets
        res = requests.get(f"{API_URL}/live/stats")
        data = res.json()
        results['Live Stats'] = "Pass" if 'total_packets' in data else f"Fail: {res.text}"
    except Exception as e:
        results['Live Stats'] = f"Fail: {e}"
        
    print("Testing Live Packet Capture Stop...")
    try:
        res = requests.post(f"{API_URL}/live/stop")
        results['Live Stop'] = "Pass" if res.status_code == 200 else f"Fail: {res.text}"
    except Exception as e:
        results['Live Stop'] = f"Fail: {e}"

    print("\n========= TEST RESULTS =========")
    for k, v in results.items():
        print(f"{k}: {v}")

if __name__ == '__main__':
    test_everything()
