from pyspark import SparkContext
from pyspark.sql import SQLContext
from pyspark.sql.types import StringType, ArrayType
from pyspark.sql.functions import udf
import re
from pyspark.ml.feature import CountVectorizer, IDF
from pyspark.ml.feature import StopWordsRemover, StringIndexer
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml import Pipeline
from pathlib import Path
from pyspark.sql.session import SparkSession
import pandas as pd
import requests

sc = SparkContext()
sqlcontext = SQLContext(sc)
spark = SparkSession(sc)

path = "training.1600000.processed.noemoticon.csv" # path to the dataset

# tweets from firebase
text = requests.get('https://pro-792c7-default-rtdb.firebaseio.com/raw.json')
data = text.json()
# clean the tweets
dict_new = {}
index = 0
for a in data:
    dict_new[index] = a
    index = index + 1
twt = pd.DataFrame(list(dict_new.items()),columns=['index','text'])
twt = twt.drop(['index'], axis=1)
# convert pd.dafaframe to spark dataframe
df2 = spark.createDataFrame(twt)

# get training data from spark
df = sqlcontext \
    .read \
    .format('com.databricks.spark.csv') \
    .options(header=False) \
    .load(path) \
    .selectExpr("_c0 as sentiment", "_c5 as message")


#Tokenize the data
tokenize = udf(
    lambda x: re.sub(r'[^A-Za-z\n ]|(http\S+)|(www.\S+)', '', \
        x.lower().strip()).split(), ArrayType(StringType())
    )
# create a column named cleaned_data, tokenize the text of each tweets
train = df.withColumn("cleaned_data", tokenize(df.message)).dropna()
test = df2.withColumn("cleaned_data", tokenize(df2.text)).dropna()


#Split into training and testing

## Create an ML Pipeline
# Clean data and perform Logistic Regression
remover = StopWordsRemover(inputCol="cleaned_data", outputCol="words")
vector_tf = CountVectorizer(inputCol="words", outputCol="tf")
idf = IDF(inputCol="tf", outputCol="features", minDocFreq=3)
label_indexer = StringIndexer(inputCol = "sentiment", outputCol = "label")
logistic_regression = LogisticRegression(maxIter=100)

pipeline = Pipeline(stages=[remover, vector_tf, idf, label_indexer, logistic_regression])

## Fit the pipeline to the training dataframe
trained_model = pipeline.fit(train)
""" lables are: 0 for postive, 1 for negative """
## Predicting the test dataframe and calculating accuracy
predictions = trained_model.transform(test)

evaluator = BinaryClassificationEvaluator(rawPredictionCol="rawPrediction")
#accuracy = evaluator.evaluate(predictions)
#print(accuracy)

# the total count of the prediction
total = predictions.count()
# total count of positive sentiment
pos = predictions.filter(predictions["prediction"] == 0.0).count()
# calculate sentiment score
score = pos/total
print(round(score*5, 3))



trained_model.write().overwrite().save("spark-model")



