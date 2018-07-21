var fetch = require('node-fetch');

const query = (searchText, response_url) => {
    fetch("http://d53bf794.ngrok.io/full_data_raw")
        .then((response) => response.json())
        .then((data) => {
            let query = req.body.text;
            let queryWords = query.split(" ");

            // iterate through individual query words and search for them
            // queryWords
            for (let queryWord in queryWords) {
                let users = data.users;
                let experienced = []; // users who have used this queryWord frequently
                let usernames = Object.keys(users);
                usernames.forEach((username) => {
                    users[username].n_sorted_words.forEach((wordObj) => {
                        let word = Object.keys(wordObj)[0];
                        if (word === queryWord){
                            experienced.push({user: username, score: wordObj.score});
                        }
                    });
            let response = {
                "attachments": []
            };
            if(experienced.length) {
                const maxLen = 10;
                experienced.sort((a, b) => a.score > b.score);
                experienced = experienced.slice(0,maxLen);
                experienced.forEach(userObj => {
                    let info = {
                        "title": `<@${userObj.user}>`,
                        "text": `frequently mentions ${users[userObj.user].n_sorted_words.slice(0,maxLen).map((skillObj) => {
                            let mention = Object.keys(skillObj)[0];
                            return mention === req.body.text ? `*${mention}*` : mention 
                            }).join(", ")
                        }`,
                        "mrkdwn_in": [
                            "text"
                        ]
                    };
                    response.attachments.push(info);
                });
                let response = {
                    "attachments": []
                };
                if (experienced.length) {
                    const maxLen = 10;
                    experienced.sort((a, b) => a.score > b.score);
                    experienced = experienced.slice(0,maxLen);
                    experienced.forEach(userObj => {
                        let info = {
                            "title": `<@${userObj.user}>`,
                            "text": `frequently mentions ${users[userObj.user].n_sorted_words.slice(0,maxLen).map((skillObj) => {
                                let mention = Object.keys(skillObj)[0];
                                return mention === searchText ? `*${mention}*` : mention
                            }).join(", ")
                                }`,
                            "mrkdwn_in": [
                                "text"
                            ]
                        };
                        response.attachments.push(info);
                    });
                    response.text = ""
                }
                else {
                    response.text = `Nothing found, sorry :(`
                }

                fetch(response_url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(response),
                })
                    .catch(console.err);

                getChannels();
            }
        });
}

const getChannels = (data, responseUrl) => {
    let users = data.users;
    let experienced = []; // users who have used this queryWord frequently
    let channelIds = Object.keys(channels);
    channelIds.forEach((channelId) => {
        users[channelId].n_sorted_words.forEach((wordObj) => {
            let word = Object.keys(wordObj)[0];
            if (word === queryWord){
                experienced.push({channel: channelId, score: wordObj.score});
            }
        })
    });
    let response = {
        "attachments": []
    };
    if (experienced.length) {
        const maxLen = 3;
        experienced.sort((a, b) => a.score > b.score);
        experienced = experienced.slice(0,maxLen);
        experienced.forEach(channelObj => {
            let info = {
                "title": `<#${channelObj.channel}>`,
                "text": `frequently mentions ${users[userObj.user].n_sorted_words.slice(0,maxLen).map((skillObj) => {
                    let mention = Object.keys(skillObj)[0];
                    return mention === searchText ? `*${mention}*` : mention
                }).join(", ")
                    }`,
                "mrkdwn_in": [
                    "text"
                ]
            };
            response.attachments.push(info);
        });
        response.text = ""
    }
    else {
        response.text = `Nothing found, sorry :(`
    }

    fetch(responseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    })
        .catch(console.err);
}

const search = ((req, res) => {
    query(req.body.text, req.body.response_url);
    res.send({text: `You searched for *${req.body.text}*, we think these people/channels could help:`});
});

module.exports = search;