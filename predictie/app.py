from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app)

with open('price_prediction_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        type_of_article_columns = ['type_of_article_Adidasi', 'type_of_article_Pantaloni', 'type_of_article_Tricouri']
        category_columns = ['category_M', 'category_W', 'category_K']
        
        input_data = [data['month'], data['year']]
        
        for col in type_of_article_columns:
            input_data.append(1 if col == f"type_of_article_{data['type_of_article']}" else 0)
        
        for col in category_columns:
            input_data.append(1 if col == f"category_{data['category']}" else 0)
        
        input_data = np.array([input_data])
        input_data_normalized = scaler.transform(input_data)
        prediction = model.predict(input_data_normalized)
        
        return jsonify({'predicted_price': prediction[0]})
    except KeyError as e:
        return jsonify({'error': f'Missing key: {e}'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
