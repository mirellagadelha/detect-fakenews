#Imports
import logging
import pandas as pd
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer, TfidfTransformer, CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import PassiveAggressiveClassifier
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

#Read model.pkl
app = Flask(__name__)
CORS(app)
model = joblib.load(open('model.pkl', 'rb'))

@app.route('/')
def home():
    return render_template(
        "index.html"
    )

def process_news(news):
    tf = joblib.load(open('tfidf_trained.pickle', 'rb'))
    news_processed = tf.transform([news])
    
    result = model.predict(news_processed)
    result = (str(result).strip('[]')).replace("'", '')
    return result

@app.route('/response', methods=['POST'])
def classify_news():
    content = request.get_json()
    label = process_news(content['news'])

    if label == 'fake':
        text = 'Essa notícia parece ser falsa. Busque fontes confiáveis.'
    else:
        text = 'Essa notícia parece ser verdadeira!  Busque fontes confiáveis antes de divulgá-la.'

    response = jsonify(
        type = label,
        message = text
    )
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    CORS(app)
    app.run(host='127.0.0.1', port=8080, threaded=True)