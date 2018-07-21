import data
import create_index
import sort
import priors

def fetch():
	messages = data.get()
	index = create_index.create_index(*messages)
	prior = priors.get_prior("prior_word_freq.txt")
	output = sort.sort(*index, prior_freq=prior)
	return output

if __name__ == "__main__":
	output = fetch()
	print(output)

