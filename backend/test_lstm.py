import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from train import train_model

try:
    print("Testing CNN-LSTM...")
    res = train_model("CNN-LSTM", None)
    print("Success:", res)
except Exception as e:
    import traceback
    traceback.print_exc()
