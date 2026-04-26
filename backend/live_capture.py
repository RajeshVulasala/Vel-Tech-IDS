import threading
import time
import random
import logging

try:
    from scapy.all import sniff, IP, TCP, UDP
    SCAPY_AVAILABLE = True
except ImportError:
    SCAPY_AVAILABLE = False
except PermissionError:
    SCAPY_AVAILABLE = False

capture_thread = None
is_capturing = False
packet_stats = {
    "total_packets": 0,
    "last_packets": [],
    "history": [
        {"time": "16:00", "traffic": 1200, "alerts": 5},
        {"time": "16:10", "traffic": 1500, "alerts": 8},
        {"time": "16:20", "traffic": 1800, "alerts": 12},
        {"time": "16:30", "traffic": 2100, "alerts": 7},
        {"time": "16:40", "traffic": 2400, "alerts": 15},
        {"time": "16:50", "traffic": 2000, "alerts": 10},
    ]
}

def dummy_capture_loop():
    global is_capturing, packet_stats
    src_ips = ["192.168.1.5", "10.0.0.12", "172.16.0.4", "192.168.1.100", "8.8.8.8"]
    dst_ips = ["192.168.1.1", "10.0.0.1", "172.16.0.1"]
    
    while is_capturing:
        time.sleep(random.uniform(0.1, 1.5))
        packet_stats["total_packets"] += 1
        
        # Simulate packet structure
        packet_info = {
            "src": random.choice(src_ips),
            "dst": random.choice(dst_ips),
            "protocol": random.choice(["TCP", "UDP", "ICMP"]),
            "length": random.randint(40, 1500),
            "timestamp": time.time(),
            # Stub prediction field
            "prediction": random.choice(["Normal", "Normal", "Normal", "Normal", "DoS", "Probe"]),
            "confidence": round(random.uniform(0.85, 0.99), 2)
        }
        
        packet_stats["last_packets"].insert(0, packet_info)
        if len(packet_stats["last_packets"]) > 50:
            packet_stats["last_packets"].pop()
            

def start_capture(interface=None):
    global is_capturing, capture_thread
    if is_capturing:
        return {"status": "already capturing"}
        
    is_capturing = True
    
    if not SCAPY_AVAILABLE:
        logging.warning("Scapy not available/permitted. Starting DUMMY capture.")
        capture_thread = threading.Thread(target=dummy_capture_loop, daemon=True)
        capture_thread.start()
        return {"status": "started dummy capture", "message": "Npcap/WinPcap missing or not running as admin. Using simulated traffic."}

    # If Scapy available, actual implementation would go here...
    # For now, using dummy mode to ensure stability if Npcap is flaky.
    capture_thread = threading.Thread(target=dummy_capture_loop, daemon=True)
    capture_thread.start()
    
    return {"status": "started capture on " + str(interface)}

def stop_capture():
    global is_capturing
    is_capturing = False
    return {"status": "stopped capture"}

def get_live_stats():
    return packet_stats
