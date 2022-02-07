import numpy as np
import pandas as pd
import requests
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM,Dense, Dropout, SpatialDropout1D
from tensorflow.keras.layers import Embedding

def userPredict():
    #get data
    text = requests.get('https://dominos-test-db-default-rtdb.firebaseio.com/text.json')
    data = text.json()
    dict_new = {}
    index = 0
    for a in data:
        dict_new[index] = a
        index = index + 1
    twt = pd.DataFrame(list(dict_new.items()),columns=['index','text'])
    twt = twt.drop(['index'], axis=1)
    twt = twt.replace('None', '').dropna()
    result = []

    df = pd.read_csv('models/twitter_data.csv')
    tweet = df.text.values
    tokenizer = Tokenizer(num_words=5000)
    tokenizer.fit_on_texts(tweet)
    encoded_docs = tokenizer.texts_to_sequences(tweet)
    padded_sequence = pad_sequences(encoded_docs, maxlen=200)
    sentiment_label = df.result.factorize()

    model = keras.models.load_model("./models/model.h5")

    #predict
    def predict_sentiment(text):
        tw = tokenizer.texts_to_sequences([text])
        tw = pad_sequences(tw,maxlen=200)
        prediction = int(model.predict(tw).round().item())
        return sentiment_label[1][prediction]


    for tweet in twt['text']:
        result.append(predict_sentiment(tweet))

    positive = result.count('positive')
    negative = result.count('negative')
    ratio = (positive / (positive + negative))*5
    return round(ratio,1)

