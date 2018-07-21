from slackclient import SlackClient
import os

# Create a SlackClient for your bot to use for Web API requests
SLACK_FETCH_TOKEN = os.environ["SLACK_FETCH_TOKEN"]
CLIENT = SlackClient(SLACK_FETCH_TOKEN)

DEBUG = False

def rprint(value):
	if DEBUG:
		print(value)
	return value

def get():
	channels = [
		channel['id']
		for channel in
		CLIENT.api_call('conversations.list', limit=1000, type='public_channel,private_channel,im,mpim')['channels']
	]

	messages = [
		rprint((message['user'], channel, message['text'], sum(
			reaction['count']
			for reaction in message['reactions']
		) if 'reactions' in message else 0))
		for channel in channels
		for message in
		CLIENT.api_call('conversations.history', channel=channel, limit=1000)['messages']
		if 'user' in message and 'text' in message
	]

	user_info = {
		user['id']: user
		for user in
		CLIENT.api_call('users.list', limit=1000)['members']
	}

	return messages, user_info

if __name__ == "__main__":
	messages = get()
	print('\n'.join(
		str(message)
		for message in messages
	))

