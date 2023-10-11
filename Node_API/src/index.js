var DB = require('./dboperations');
var Flights = require('./Airline');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api' , router);

router.use((req,res,next) => {
    console.log('Middleware');
    next();
})

router.route('/flights').get((req,res) => {
    DB.getFlights().then(result => {
        //console.log(result);
        res.json(result[0]);
    })
})

router.route('/flights/:id').get((req,res) => {
    DB.getFlight(req.params.id).then(result => {
        //console.log(result);
        res.json(result[0]);
    })
})



const port = process.env.PORT || 8080;
app.listen(port);
console.log('http://localhost:8080');



