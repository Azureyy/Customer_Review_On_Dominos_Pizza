from pyspark.ml.pipeline import PipelineModel
import pandas as pd
import requests
from pyspark import SparkContext
from pyspark.sql import SQLContext
from pyspark.sql.session import SparkSession
import requests
from pyspark.sql.functions import udf
import re
from pyspark.sql.types import StringType, ArrayType

def sparkPredict():
    sc = SparkContext.getOrCreate()
    spark = SparkSession(sc)

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

    #Tokenize the data
    tokenize = udf(
        lambda x: re.sub(r'[^A-Za-z\n ]|(http\S+)|(www.\S+)', '', \
            x.lower().strip()).split(), ArrayType(StringType())
        )
    test = df2.withColumn("cleaned_data", tokenize(df2.text)).dropna()



    # save best model to specified path
    mPath =  "./spark-model"
    model = PipelineModel.load(mPath)
    # predict
    predictions = model.transform(test)
    # the total count of the prediction
    total = predictions.count()
    # total count of positive sentiment
    pos = predictions.filter(predictions["prediction"] == 0.0).count()
    # calculate sentiment score
    score = pos/total
    return round(score*5, 1)

