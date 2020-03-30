# [START app]
import logging

# [START imports]
from flask import Flask, jsonify, render_template, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
# [END imports]

# [START create_app]
app = Flask(__name__)
# [END create_app]

def process_news(news):
  #tf = TfidfVectorizer()
  news_processed = [news]
  
  #X_counts = tf.fit_transform(pergunta_processed)
  #tf_transformer = TfidfTransformer(use_idf=True).fit(X_counts)
  return news_processed

@app.route('/response', methods=['POST'])
def new():
    content = request.get_json()
    response = process_news(content['news'])
    return jsonify(
        response = response,
    )