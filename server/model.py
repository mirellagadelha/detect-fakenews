#Imports
import pandas as pd
import pickle
from sklearn.externals import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.externals import joblib

#Read data
news = pd.read_csv("news-list.csv", sep=";")
news_type = news.type
news = news.drop("type", axis=1)

#Fit and transform train set, transform test set
news_train, news_test, type_train, type_test = train_test_split(news["data"], news_type, test_size=0.33, random_state=53)

tfidf_vectorizer = TfidfVectorizer(max_df=0.7)
tfidf_train = tfidf_vectorizer.fit_transform(news_train)
tfidf_test = tfidf_vectorizer.transform(news_test)
train = tfidf_train.toarray()

#Save data into a pickle file
pickle.dump(tfidf_vectorizer, open("tfidf_trained.pickle", "wb"))

#Predict on the test set
model_linear = PassiveAggressiveClassifier(max_iter=1000)
model_linear.fit(train, type_train)

joblib.dump(model_linear, "model.pkl")