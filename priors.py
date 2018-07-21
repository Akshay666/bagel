import pandas as pd

def get_prior(file):
    prior = pd.read_csv(file, sep='\t')
    total_freq = sum(prior['frequency'])
    return {word : float(freq)/total_freq for index, (a, b, c, word, freq) in prior.iterrows()} 

if __name__ == "__main__":
    print(get_prior("prior_word_freq.txt"))

