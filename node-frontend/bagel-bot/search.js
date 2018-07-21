var fetch = require('node-fetch');

const search = ((req, res) => {
    let data = fetch("http://4d2561bc.ngrok.io/full_data_raw")
        .then((response) => response.json())
        .then((data) => {
            let experienced = [];
            Object.keys(data).forEach((user) => {
                data[user].n_sorted_words.forEach((wordObj) => {
                    let word = Object.keys(wordObj)[0];
                    if(word === req.body.text){
                        experienced.push(user);
                    }
                })
            });

            let response = {
                "text": `You searched for ${req.body.text}, we think these people could help:`,
                "attachments": []
            };
            experienced.forEach(userId => {
                let info = {
                    "title": `<@${userId}>`,
                    "text": `expert in ${data[userId].n_sorted_words.map((skillObj) => Object.keys(skillObj)[0]).join(", ")}`,
                    "mrkdwn_in": [
                        "text"
                    ]
                };
                response.attachments.push(info);
            });
            res.send(response);
        });
});

module.exports = search;