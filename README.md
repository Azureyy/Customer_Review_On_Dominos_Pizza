# Customer_Review_On_Dominos_Pizza
# Motivation
The motivation behind the project is that people’s purchasing decisions nowadays are easily influenced by social media testimonials about the specific products sold by the vendors. Companies would also like to build a strong brand image by providing timely customer service and tracking comments about their products through social media. Therefore, our group decided to set our focus on providing the general customer reviews on a well-known brand by tracking its Twitter data. In this case, we picked Domino’s Pizza because they are known for their utilization of social media accounts.

# Overview
The web application is developed to satisfy two main goals of this project. First is to provide an overall assessment of the customer review on Domino’s Pizza by analyzing the real-time tweets generated from Domino’s Twitter account. We would like to provide a rating on a scale of 0 to 5 based on the sentiment from the streaming twitter data. Another goal is to allow users/business owners to upload their collected customer reviews and learn about the attitude of their customers towards their product.

# Frontend
The frontend of the web application is developed using HTML/CSS and JavaScript. The static frontend components are rendered using React and styled with Bootstrap. Any data requests would be sent to the backend and the server is developed with the Flask framework. Depending on the request, the server side will request data from the Twitter API/the database and the machine learning models will train and predict using the dataset obtained. After that, the output will be updated within the database and the model result will be sent back to the frontend and rendered on the web page. The machine learning models are developed using Apache Spark and Jupyter Notebook. The streaming data will be handled by Apache Kafka, which tracks the streaming data and provides the update to the firebase.

# Database
The Dominos data was extracted from Twitter using Python Tweepy package Cursor to get the fresh data within several days. Users can select how many tweets they want to evaluate. As they enter a number for tweets, the system will start to get twitter data, clean it using the NLTK package then send both raw and processed data to the cloud database, Firebase.

# Streaming data
Tweepy stream listener function is used to get streaming data with the help of Apache Kafka stream-processing software platform. Kafka handles data as a topic so we publish the streaming tweets to a topic by a producer. Kafka-python is utilized to initialize the Kafka producer which is the python client for Kafka. Then, the built-in Afinn package in Python is used to provide a general sentiment score of the given tweet. Next, the data are stored and scored back to Firebase so that users can get real-time comments using the app.

# Machine Learning Algorithm
## Sentiment Analysis:
Sentiment Analysis is a process of deciding whether a piece of writing is positive or negative. That is to say, it evaluates the attitude of the speaker. Basically this web app has been splitted to two ML techniques to conduct sentiment analysis: the LSTM model and the Spark Logistic Regression model.

## Long-Short Term Memory (LSTM):
Python sentiment analysis is a methodology for analyzing a piece of text to discover the sentiment hidden within it. It accomplishes this by combining machine learning and natural language processing (NLP). The LSTM layers are utilized to build a binary text classifier to classify the sentiment behind domino's pizza comments. LSTM is a variant of RNN which is used with sequential data such as text. Over 1000 data samples are classified into two types: positive and negative. The architecture in our model consists of an embedding layer, an LSTM layer, and a dense layer.

## SparkML:
Apache Spark structured streaming is used to handle the streaming data in the form of data frames. Data gained from the Twitter streaming would be pre-processed and passed in to a machine learning pipeline. Here the web app is using the Stanford’s dataset (http://help.sentiment140.com/for-students), which contains 1.6 million tweets, to train the Spark Logistic Regression model trying to provide the sentiment score of a given tweet. Spark ML library is used to create a machine learning pipeline. Each tweet is tokenized and filtered of urls and punctuations as the cleaning step. Then stop words would be removed and the tweets would be vectorized and being calculated using CountVectorizer. The Inverse Document Frequency is also calculated as the next step. After being processed with above features, the tweets are able to be passed to the classifier, which is Logistic Regression in our project. The overall prediction accuracy of the model is over 83%. The training model is saved for future use in prediction of the streaming Twitter data.
