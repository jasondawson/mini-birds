var BodyParser = require('body-parser');
var Cors = require('cors');
var Express = require('express');
var Mongoose = require('mongoose');
var MongoJS = require('mongojs');
var port = 8080;
var app = Express();


//middleware
app.use(BodyParser.urlencoded({extended: false}));
app.use(BodyParser.json());

//db connection

var db = MongoJS('BirdSightings', ['sighting']);


//API endpoints

app.post('/api/sighting', function (req, res) {
  db.sighting.insert(req.body, function (err, results) {
    if (err) {
      res.status(500).json(err);
    }
    else res.status(200).json(results);
  });
});

app.get('/api/sighting', function (req, res) {
  if (req.query.region && !req.query.species) {
    //return region results
    db.sighting.find({region: req.query.region}, function (err, results) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(results);
      }
    });
  }
  else if (req.query.species && !req.query.region) {
    //return species results
    db.sighting.find({bird: req.query.species}, function (err, results) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(results);
      }
    });

  }
  else {
    //return all results
    db.sighting.find(function (err, results) {
      res.status(200).json(results);
    });
  }
});

app.put('/api/sighting', function (req, res) {
  console.log(req.query.id);
  db.sighting.findAndModify({
    query: {_id : MongoJS.ObjectId(req.query.id)},
    update: { $set: {'bird' : req.body.bird,
                     'region': req.body.region} },
    new: true
}, function(err, results) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(results);
      }
});
})

app.delete('/api/sighting', function (req, res) {
  console.log(req.query.id);
  db.sighting.remove(
    {_id: MongoJS.ObjectId(req.query.id)}
  , function(err, results) {
      if (err) {
        res.status(500).json(err);
      }
      else {
        res.status(200).json(results);
      }
  })
})






app.listen(port, function () {
  console.log('Listening on port ' + port);
})
