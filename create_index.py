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

        for word in re.findall(r"[\w']+", message): #message.split():
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
    return user_words, channel_words, user_msgs

if __name__ == "__main__":
    msgs = [("user1", "fruits", "I love fruits love", 3),
    ("user2", "veggies", "what's kale", 5),
    ("user5", "engineering", "what's python?", 0),
    ("user7", "veggies", "where do i buy kale", 1),
    ("user2", "fruits", "what's watermelon", 2)]

    user_words, channel_words, user_msgs = create_index(msgs)
    print(user_words)
    print(channel_words)
    print(user_msgs)