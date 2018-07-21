import re

def create_index(messages):
    user_words, channel_words, user_msgs = {}, {}, {}
    for user, channel, message, n_reactions in messages:
        if user in user_words:
            user_msgs[user][message] = n_reactions
            u_word_freq = user_words[user]
        else:
            user_msgs[user] = {message:n_reactions}
            u_word_freq = {}
        if channel in channel_words:
            c_word_freq = channel_words[channel]
        else:
            c_word_freq = {}

        for word in re.findall(r"[\w']+", message):
            word = word.lower()
            if word in u_word_freq:
                u_word_freq[word] = u_word_freq[word]+1
            else:
                u_word_freq[word] = 1
            if word in c_word_freq:
                c_word_freq[word] = c_word_freq[word]+1
            else:
                c_word_freq[word] = 1

        user_words[user] = u_word_freq
        channel_words[channel] = c_word_freq
    return normalize_freq(user_words), normalize_freq(channel_words), user_msgs

def normalize_freq(user_words):
    norm_user_words = {}
    for user in user_words:
        u_word_freq = user_words[user]
        sum_word_freq = sum(u_word_freq.values())
        for word in u_word_freq:
            u_word_freq[word] = u_word_freq[word]/sum_word_freq
        norm_user_words[user] = u_word_freq
    return norm_user_words

if __name__ == "__main__":
    msgs = [("user1", "fruits", "I love fruits love", 3),
    ("user2", "veggies", "what's kale", 5),
    ("user5", "engineering", "what's python?", 0),
    ("user7", "veggies", "where do i buy kale. where?", 1),
    ("user2", "fruits", "what's watermelon", 2)]

    user_words, channel_words, user_msgs = create_index(msgs)
    print(user_words)
    print(channel_words)
    print(user_msgs)