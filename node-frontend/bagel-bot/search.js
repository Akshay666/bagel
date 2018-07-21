const search = ((req,res) => {
    res.send({text: `looks like you typed ${req.body.text}`});
});

module.exports = search;