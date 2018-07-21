var fetch = require('node-fetch');

const query = (searchText, response_url) => {
    fetch("http://d53bf794.ngrok.io/full_data_raw")
        .then((response) => response.json())
        .then((data) => {
            let users = data.users;
            let experienced = [];
            Object.keys(users).forEach((user) => {
                users[user].n_sorted_words.forEach((wordObj) => {
                    let word = Object.keys(wordObj)[0];
                    if (word === searchText){
                        experienced.push({user: user, score: wordObj.score, img: users[user].info.profile.image_original, title: users[user].info.profile.title});
                    }
                })
            });
            let response = {
                "attachments": []
            };
            if(experienced.length) {
                const maxLen = 5;
                experienced.sort((a, b)=> a.score > b.score);
                experienced = experienced.slice(0,maxLen);
                experienced.forEach(userObj => {
                    let info = {
                        "title": `<@${userObj.user}>${userObj.title ? ", " + userObj.title : ""}`,
                        "text": `frequently mentions ${users[userObj.user].n_sorted_words.slice(0,maxLen).map((skillObj) => {
                            let mention = Object.keys(skillObj)[0];
                            return mention === searchText ? `*${mention}*` : mention
                        }).join(", ")
                            }`,
                        "thumb_url": userObj.img,
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
        });
};
const search = ((req, res) => {
    if(!req.body.text){
        res.send({text: "You didn't search for anything!"});
    }
    else {
        query(req.body.text, req.body.response_url);
        res.send({text: `:tada: You searched for *${req.body.text}*, we think these people/channels could help:`});
    }

});

module.exports = search;