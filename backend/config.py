import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    API_KEY = os.getenv('API_KEY')
    API_BASE_URL = os.getenv('API_BASE_URL') 