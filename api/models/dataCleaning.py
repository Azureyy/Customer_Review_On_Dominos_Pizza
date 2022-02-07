import tweepy as tw
import numpy as np
import pandas as pd
import requests
import nltk
from nltk.tokenize import TweetTokenizer
from nltk.tag import pos_tag    # Part-of-speech tagger
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
import re
from string import punctuation



def clean(twi):
  # Instantiate a tweet tokenizer that will preserve each word (or token) as it is
  tweet_tokenizer = TweetTokenizer(preserve_case = True,reduce_len = False, strip_handles = False)
  tokens = [tweet_tokenizer.tokenize(t) for t in twi]
  # Part-of-speech tagger
  nltk.download('averaged_perceptron_tagger')
  tags = [pos_tag(t) for t in tokens]

  # know the type of each word (Noun, Verb, or others)
  nltk.download('wordnet')
  def _tag2type(tag):
      '''
      NN for noun, VB for verb, otherwise any
      '''
      if tag.startswith('NN'):
          return 'n'
      elif tag.startswith('VB'):
          return 'v'
      else:
          return 'a'

  lemmatizer = WordNetLemmatizer()
  lemma = [[lemmatizer.lemmatize(word, _tag2type(t)) for (word, t) in tag] for tag in tags]

  #remove stopwords
  nltk.download('stopwords')
  stopwords = nltk.corpus.stopwords.words('english')
  def _is_noise(word):
      pattern = 'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+|(@[A-Za-z0-9_]+)'
      return word in punctuation \
          or word.lower() in stopwords \
          or re.search(pattern, word, re.IGNORECASE) != None
  #remove noise
  denoised = [[p.lower() for p in _list if not _is_noise(p)] for _list in lemma]
  total = {}
  for a in range(0, len(denoised), 1):
      total[a] = denoised[a]
  #upload to firebase
  df_new = pd.DataFrame(list(total.items()),columns = ['index','text']) 
  df_new = df_new.drop(['index'], axis=1)
  df_new.dropna()
  twt2=df_new['text'].to_dict()
  requests.put('https://dominos-test-db-default-rtdb.firebaseio.com/text.json',json=twt2)

  
    