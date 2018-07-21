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
    let string = "";
    experienced.forEach(userObj => {
        let username =  Object.keys(userObj);
        let string2 = `${username} is good at: `;
        userObj.n_sorted_words.forEach((word) => string2 += ` - ${word}\n`)
        string += string2
    });
    res.send({text: string});
});

module.exports = search;