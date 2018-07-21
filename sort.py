import collections

def sort(user_words, user_channels, user_messages, channel_words, prior_freq):
	n = 1000
	m = 10

	global_frequencies = collections.defaultdict(int)
	for user, uwords in user_words.items():
		for word, freq in uwords.items():
			global_frequencies[word] += freq

	def prior(word):
		return prior_freq[word] if word in prior_freq else 0.0

	def score(word, freq):
		return freq / global_frequencies[word] #+ prior(word))

	return {
		'users': {
			user: {
				'n_sorted_words': sorted([
					{word: score(word, freq)}
					for word, freq in uwords.items()
				], key=lambda d: -list(d.items())[0][1])[:n],
				'm_sorted_comments': sorted([
					{message: reactions}
					for message, reactions in user_messages[user].items()
				], key=lambda d: -list(d.items())[0][1])[:m],
				'k_top_channels': sorted([
					{channel: counts}
					for channel, counts in user_channels[user].items()
				], key=lambda d: -list(d.items())[0][1])[:m],
			} for user, uwords in user_words.items()
		},
		'channels': {
			channel: {
				'n_sorted_words': sorted([
					{word: score(word, freq)}
					for word, freq in cwords.items()
				], key=lambda d: -list(d.items())[0][1])[:n],
			} for channel, cwords in channel_words.items()
		},
	}

