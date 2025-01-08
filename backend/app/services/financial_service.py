import requests
from flask import current_app
import os

class FinancialService:
    def __init__(self):
        self.base_url = os.getenv('API_BASE_URL')

    def get_financial_data(self, start_year=None, end_year=None, 
                          min_revenue=None, max_revenue=None,
                          min_net_income=None, max_net_income=None,
                          sort_by='date', sort_direction='desc'):
        # Fetch raw data
        data = self._fetch_from_api()
        
        if not data:
            return []

        # Apply filters if provided
        filtered_data = self._apply_filters(
            data,
            start_year=start_year,
            end_year=end_year,
            min_revenue=min_revenue,
            max_revenue=max_revenue,
            min_net_income=min_net_income,
            max_net_income=max_net_income
        )

        # Apply sorting
        sorted_data = self._apply_sorting(filtered_data, sort_by, sort_direction)
        
        return sorted_data

    def _fetch_from_api(self):
        try:
            api_key = os.getenv('API_KEY')
            full_url = f"{self.base_url}&apikey={api_key}"
            print("Full API URL:", full_url)
            
            response = requests.get(full_url)
            print("Status Code:", response.status_code)
            
            if response.status_code == 200:
                data = response.json()
                print("Raw API Response:", data)
                
                if isinstance(data, list):
                    processed_data = [{
                        'date': item.get('date'),
                        'revenue': item.get('revenue'),
                        'netIncome': item.get('netIncome'),
                        'grossProfit': item.get('grossProfit'),
                        'eps': item.get('eps'),
                        'operatingIncome': item.get('operatingIncome')
                    } for item in data]
                    return processed_data
            return None
        except Exception as e:
            print(f"Error in _fetch_from_api: {str(e)}")
            return None

    def _apply_filters(self, data, **filters):
        filtered_data = data.copy()
        
        if filters.get('start_year'):
            filtered_data = [d for d in filtered_data if d['date'][:4] >= filters['start_year']]
        
        if filters.get('end_year'):
            filtered_data = [d for d in filtered_data if d['date'][:4] <= filters['end_year']]
        
        if filters.get('min_revenue'):
            filtered_data = [d for d in filtered_data if d['revenue'] >= float(filters['min_revenue'])]
            
        if filters.get('max_revenue'):
            filtered_data = [d for d in filtered_data if d['revenue'] <= float(filters['max_revenue'])]
            
        if filters.get('min_net_income'):
            filtered_data = [d for d in filtered_data if d['netIncome'] >= float(filters['min_net_income'])]
            
        if filters.get('max_net_income'):
            filtered_data = [d for d in filtered_data if d['netIncome'] <= float(filters['max_net_income'])]
            
        return filtered_data

    def _apply_sorting(self, data, sort_by, direction):
        if not data:
            return data
            
        reverse = direction.lower() == 'desc'
        
        sorting_keys = {
            'date': 'date',
            'revenue': 'revenue',
            'netIncome': 'netIncome'
        }
        
        key = sorting_keys.get(sort_by, 'date')
        return sorted(data, key=lambda x: x[key], reverse=reverse)