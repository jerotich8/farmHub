from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pymysql
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app) 

# Database connection
def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        cursorclass=pymysql.cursors.DictCursor
    )

# Route to recommend the best market
@app.route('/api/recommend-market', methods=['POST'])
def recommend_market():
    data = request.json
    crop_name = data.get('crop_name')

    if not crop_name:
        return jsonify({"message": "Crop name is required"}), 400

    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            query = """
                SELECT 
                    m.market_name,
                    m.county,
                    p.wholesale_price,
                    p.retail_price
                FROM prices p
                INNER JOIN markets m ON p.market_name = m.market_name
                WHERE p.crop_name = %s
                ORDER BY p.wholesale_price ASC
                LIMIT 1
            """
            cursor.execute(query, (crop_name,))
            result = cursor.fetchone()

        connection.close()

        if result:
            return jsonify(result), 200
        else:
            return jsonify({"message": f"No market recommendation found for '{crop_name}'."}), 404

    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
