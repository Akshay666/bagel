const search = ((req,res) => {
    let data = require("./yoyo.json");
    let experienced = [];
    Object.keys(data).forEach((user) => {
        data[user].n_sorted_words.forEach((wordObj) => {
            let word = Object.keys(wordObj)[0];
            if(word === req.body.text){
                experienced.push(user);
            }
        })
    });

    let message_per_user = `${experienced[i]} has experience in {}`
    experienced.forEach(userObj => userObj.)
    let string = ``
    res.send({text: string});
});

module.exports = search;