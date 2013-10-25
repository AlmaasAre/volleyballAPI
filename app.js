

var express = require('express'), mongoskin = require('mongoskin');


var app = express();


app.use(express.bodyParser());

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

var db = mongoskin.db('mongodb://volleyballen:volleyball123@ds051658.mongolab.com:51658/volleyball_api', {safe:true});

app.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName)
    return next()
});

app.get('/', function(req, res) {
    res.send('please select a collection, e.g., /collections/messages')
});

app.get('/collections/:collectionName', function(req, res) {
    req.collection.find({},{sort: [['_id',-1]]}).toArray(function(e, results){
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collections/:collectionName', function(req, res) {
    req.collection.insert(req.body, {}, function(e, results){
        if (e) return next(e)
        res.send(results)
    })
});

app.get('/collections/:collectionName/:id', function(req, res) {
    req.collection.findOne({_id: req.collection.id(req.params.id)}, function(e, result){
        if (e) return next(e)
        res.send(result)
    })
});

app.put('/collections/:collectionName/:id', function(req, res) {
    req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, result){
        if (e) return next(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'})
    })
});

app.del('/collections/:collectionName/:id', function(req, res) {
    req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result){
        if (e) return next(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'})
    })
});

app.listen(process.env.PORT || 3000);