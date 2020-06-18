var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var bodyParser = require('body-parser');    
const Nedb = require('nedb');
const db = new Nedb({
    filename : './data.db', 
    autoload : true 
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine','ejs');
app.set('views','./views');
app.use(express.static('pub'));


app.get('/', function(req, res) {
    db.find({}, function(err, doc){
        if(err !== null){
            console.log(err);
            return;
        }
        let text = [];
        let id = [];

        for (let i = 0; i < doc.length; i++) {
            text.push(doc[i].text);
            id.push(doc[i]._id);
        }

        res.render("index", {
            text : text,
            id : id
        });
    });
});


app.post('/ck', function(req,res){
    let timestamp = new Date().getTime();
    var rand = Math.floor(Math.random() * 999);

    if (req.body.text === ``) {
        res.send(`<script type="text/javascript"> location.href="/"; </script>`);

    } else{
        var doc = {
            _id : String(timestamp)+"-"+String(rand),
            name : 'aaa',
            text : req.body.text
        };
    
        db.insert(doc, function (err, newDoc) {
            if(err !== null){
                console.log(err);
                return;
            }
            console.log(newDoc);
            res.send(`<script type="text/javascript"> location.href="/"; </script>`);
        
         
    
        });
    }



});



server.listen(4000);