# common.py
import os
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def log_info(message: str):
    """Logs informational messages."""
    logging.info(message)

def log_error(message: str):
    """Logs error messages."""
    logging.error(message)

def create_folder(folder_path: str):
    """Creates a directory if it doesn't exist."""
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
