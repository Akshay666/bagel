var fetch = require('node-fetch');

const search = ((req, res) => {
    let data = fetch("http://d53bf794.ngrok.io/full_data_raw")
        .then((response) => response.json())
        .then((data) => {
            let users = data.users;
            let experienced = [];
            Object.keys(users).forEach((user) => {
                users[user].n_sorted_words.forEach((wordObj) => {
                    let word = Object.keys(wordObj)[0];
                    if (word === req.body.text){
                        experienced.push({user: user, score: wordObj.score});
                    }
                })
            });
            let response = {
                "attachments": []
            };
            if(experienced.length) {
                const maxLen = 10;
                experienced.sort((a, b)=> a.score > b.score);
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
                response.text = `You searched for *${req.body.text}*, we think these people could help:`
            }
            else {
                response.text = `Nobody found for *${req.body.text}*, sorry :(`
            }
            res.send(response);
        });
});

module.exports = search;