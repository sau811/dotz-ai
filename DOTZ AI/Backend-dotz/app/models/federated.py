# federated.py
import torch
import os

FEDERATED_DIR = "./federated"
os.makedirs(FEDERATED_DIR, exist_ok=True)

def save_local_update(user_id: str, model_update: torch.Tensor):
    """Saves local model updates for federated learning"""
    torch.save(model_update, os.path.join(FEDERATED_DIR, f"{user_id}_update.pth"))

def aggregate_model():
    """Aggregates model updates from multiple users"""
    updates = [torch.load(os.path.join(FEDERATED_DIR, f)) for f in os.listdir(FEDERATED_DIR)]
    return torch.mean(torch.stack(updates), dim=0)
