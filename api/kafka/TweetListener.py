from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener
import json
import config
import pykafka
from afinn import Afinn
import sys
import requests

class TweetListener(StreamListener):
	def __init__(self):
		self.client = pykafka.KafkaClient("localhost:9092")
		self.producer = self.client.topics[bytes('twitter','ascii')].get_producer()

	def on_data(self, data):
		try:
			json_data = json.loads(data)

			send_data = '{}'
			send_data_json = json.loads(send_data)
			send_data_json['text'] = json_data['text']
			send_data_json['created_at'] = json_data['created_at']
			send_data_json['senti_val']=afinn.score(json_data['text'])
			#send_data_json['senti_val']=json_data['polarity']

			print(send_data_json['text'], " \n sentiment score: ", send_data_json['senti_val'])

			requests.put("https://pro-792c7-default-rtdb.firebaseio.com/stream.json", json = send_data_json)
			self.producer.produce(bytes(json.dumps(send_data_json),'ascii'))
			return True
		except KeyError:
			return True

	def on_error(self, status):
		print(status)
		return True

if __name__ == "__main__":
	if len(sys.argv) != 2:
		print("Must includes: ex.py <target>", file=sys.stderr)
		exit(-1)

	word = sys.argv[1]

	consumer_key = config.consumer_key
	consumer_secret = config.consumer_secret
	access_token = config.access_token
	access_secret = config.access_secret

	auth = OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_secret)

	# create AFINN object for sentiment analysis
	afinn = Afinn()

	twitter_stream = Stream(auth, TweetListener())
	twitter_stream.filter(languages=['en'], track=[word])
