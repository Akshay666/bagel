const fetch = require('node-fetch');

const ngrokBackend = "http://d53bf794.ngrok.io/full_data_raw"

const query = (searchText, responseUrl) => {
    fetch(ngrokBackend)
        .then((response) => response.json())
        .then((data) => {
            getUsers(searchText, data, responseUrl, getChannels);
        });
};

const maxPeoples = 3;
const maxSkills = 5;
const maxComments = 2;

const getUsers = (searchText, data, responseUrl, cb) => {
    let users = data.users;
    let experienced = [];
    let userNames = Object.keys(users);

    userNames.forEach((userName) => {
        users[userName].n_sorted_words.forEach((wordObj) => {
            let word = Object.keys(wordObj)[0];
            if (word === searchText){
                let relevantInfo = {
                    user: userName,
                    score: wordObj.score,
                    img: users[userName].info.profile.image_original,
                    title: users[userName].info.profile.real_name,
                }

                experienced.push(relevantInfo);
            }
        })
    });

    let info = [];

    if(experienced.length) {
        experienced.sort((a, b) => a.score > b.score);
        experienced = experienced.slice(0, maxPeoples);
        experienced.forEach(userObj => {

            let freqMentioned = users[userObj.user].n_sorted_words.slice(0, maxSkills).map((skillObj) => {
                let mention = Object.keys(skillObj)[0];
                return mention === searchText ? `*${mention}` : mention;
            }).join(", ");

            let userComments = users[userObj.user].m_sorted_comments
            let userHasComments = userComments.length;

            info.push({
                "title": `<@${userObj.user}>${userObj.title ? ", " + userObj.title: ""}`,
                "text": `_frequently mentions:_ ${freqMentioned} ${userHasComments ? "\n*Top Comments*" : ""}`,
                "fields": userComments.slice(0, maxComments).map((commentObj) => {
                    let comment = Object.keys(commentObj)[0];
                    let editedComment = comment.slice(0, 100).replace(/\n|\r/g, " ");
                    let commentScore = commentObj[comment];
                    return {value : `*${commentScore}* :arrow_up_small: ${editedComment} ${comment.length > 100 ? "..." : ""}`}
                }),
                "thumb_url": userObj.img,
                "mrkdwn_in": [
                    "text"
                ],
            });
        });
    }

    let response = {
        "text": experienced.length ? "*People* :wave:" : `Nothing found, sorry :(`,
        "attachments": info
    };

    fetch(responseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    }).then((hi)=>{
        cb(searchText, data, responseUrl);
    });


};

const getChannels = (searchText, data, responseUrl) => {
    let channels = data.channels;
    let experienced = []; // users who have used this queryWord frequently
    let channelIds = Object.keys(channels);

    channelIds.forEach((channelId) => {


        channels[channelId].n_sorted_words.forEach((wordObj) => {

            let word = Object.keys(wordObj)[0];
            if (word === searchText) {
                experienced.push({channel: channelId, score: wordObj[word]});
            }
        })
    });

    let info;
    const maxLen = 3;
    experienced.sort((a, b) => a.score > b.score);

    experienced = experienced.slice(0, maxLen);
    experienced.forEach(channelObj => {

        info = {
            "title": `<#${channelObj.channel}>`,
            "text": `_frequently mentions:_ ${channels[channelObj.channel].n_sorted_words.slice(0, maxLen).map((otherWord) => {
                let mention = Object.keys(otherWord)[0];
                return mention === searchText ? `*${mention}*` : mention
            }).join(", ")
                }`,
            "mrkdwn_in": [
                "text"
            ]
        };

    });

    let response = {
        "text": info ? "*Channels* :slack:" : "",
        "attachments" : [info]
    };


    fetch(responseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
    })
        .catch(console.err);
};

const search = ((req, res) => {
    if(!req.body.text){
        res.send({text: "You didn't search for anything!"});
    }
    else {
        query(req.body.text, req.body.response_url);
        res.send({text: `:bagel: You searched for *${req.body.text}*, we think these people/channels could help:`});
    }

});

module.exports = search;