const search = ((req,res) => {
    let data = require("./yoyo.json");
    let helper = "someone not on this team....";
    Object.keys(data).forEach((user) => {
        data[user].n_sorted_words.forEach((obj)=> {
            if(Object.keys(obj)[0] === req.body.text){
                helper = user;
            }
        })
    })
    res.send({text: `I think you should contact ${helper}!`});
});

module.exports = search;