from flask import Blueprint, jsonify, request
from app.services.financial_service import FinancialService

main = Blueprint('main', __name__)
financial_service = FinancialService()

@main.route('/')
def index():
    return jsonify({"message": "Financial Data API is running"})

@main.route('/api/financial-data')
def get_financial_data():
    # Get query parameters
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    min_revenue = request.args.get('min_revenue')
    max_revenue = request.args.get('max_revenue')
    min_net_income = request.args.get('min_net_income')
    max_net_income = request.args.get('max_net_income')
    sort_by = request.args.get('sort_by', 'date')
    sort_direction = request.args.get('sort_direction', 'desc')

    # Get filtered and sorted data
    data = financial_service.get_financial_data(
        start_year=start_year,
        end_year=end_year,
        min_revenue=min_revenue,
        max_revenue=max_revenue,
        min_net_income=min_net_income,
        max_net_income=max_net_income,
        sort_by=sort_by,
        sort_direction=sort_direction
    )

    return jsonify({
        "status": "success",
        "data": data
    })