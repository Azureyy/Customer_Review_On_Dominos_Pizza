import numpy as np
import pandas as pd
import requests
import joblib
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM,Dense, Dropout, SpatialDropout1D
from tensorflow.keras.layers import Embedding



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

#train model
df = pd.read_csv('twitter_data.csv')
tweet = df.text.values
tokenizer = Tokenizer(num_words=5000)
tokenizer.fit_on_texts(tweet)
encoded_docs = tokenizer.texts_to_sequences(tweet)
padded_sequence = pad_sequences(encoded_docs, maxlen=200)
sentiment_label = df.result.factorize()

embedding_vector_length = 32
mod = Sequential()
mod.add(Embedding(2500, 32, input_length=200))
mod.add(SpatialDropout1D(0.25))
mod.add(LSTM(50, dropout=0.5, recurrent_dropout=0.5))
mod.add(Dropout(0.2))
mod.add(Dense(1, activation='sigmoid'))
mod.compile(loss='binary_crossentropy',optimizer='adam', metrics=['accuracy'])
history = mod.fit(padded_sequence,sentiment_label[0],validation_split=0.2, epochs=22, batch_size=32)

#predict
def predict_sentiment(text):
    tw = tokenizer.texts_to_sequences([text])
    tw = pad_sequences(tw,maxlen=200)
    prediction = int(mod.predict(tw).round().item())
    return sentiment_label[1][prediction]


for tweet in twt['text']:
    result.append(predict_sentiment(tweet))

positive = result.count('positive')
negative = result.count('negative')
ratio = (positive / (positive + negative))*5
print(ratio) 

mod.save("model.h5")

def predict():
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

    model = keras.models.load_model("model.h5")

    #predict
    def predict_sentiment(text):
        tw = tokenizer.texts_to_sequences([text])
        tw = pad_sequences(tw,maxlen=200)
        prediction = int(model.predict(tw).round().item())
        return ['positive', 'negative'][prediction]


    for tweet in twt['text']:
        result.append(predict_sentiment(tweet))

    positive = result.count('positive')
    negative = result.count('negative')
    ratio = (positive / (positive + negative))*5
    return ratio