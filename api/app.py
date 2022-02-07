from flask import Flask, request
from tensorflow import keras
import os
import json
import ast
import numpy as np
from models.dataCleaning import clean
from models.userPredict import userPredict
from models.SparkPredict import sparkPredict



app = Flask(__name__)

@app.route("/dominoScore", methods = ['GET'])
def getScore():
    print("server!")
    score = str(sparkPredict())
    return score

@app.route("/getUserScore", methods = ['GET','POST'])
def userScore():
    if request.method == "POST":
        result = request.data
        result = json.loads(result.decode("utf-8"))
        clean(result) #clean data and send to firebase
        score = str(userPredict())
        print("complete keras model:",score)
        return {"score": score}
    
    return "default"

if __name__ == "__main__":
	app.run(use_reloader= True )
