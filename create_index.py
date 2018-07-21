import re

def create_index(messages, user_info):
    user_words, user_channels, channel_words, user_msgs = {}, {}, {}, {}
    for user, channel, message, n_reactions in messages:
        if user in user_words:
            user_channels[user][channel] = user_channels[user][channel]+1.0 if channel in user_channels[user] else 1.0
            user_msgs[user][message] = float(n_reactions)
            u_word_freq = user_words[user]
        else:
            user_channels[user] = {channel:1.0}
            user_msgs[user] = {message:float(n_reactions)}
            u_word_freq = {}
        c_word_freq = channel_words[channel] if channel in channel_words else {}

        for word in re.findall(r"[\w']+", message):
            word = word.lower()
            u_word_freq[word] = u_word_freq[word]+1.0 if word in u_word_freq else 1.0
            c_word_freq[word] = c_word_freq[word]+1.0 if word in c_word_freq else 1.0
        user_words[user] = u_word_freq
        channel_words[channel] = c_word_freq
    return normalize_freq(user_words), user_channels, user_msgs, normalize_freq(channel_words), user_info

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
    ("user2", "fruits", "what's watermelon", 2),
    ("user1", "fruits", "where can I buy watermelon?", 2)]

    user_words, user_channels, user_msgs, channel_words = create_index(msgs)
    print(user_words)
    print(user_channels)
    print(user_msgs)
    print(channel_words)
