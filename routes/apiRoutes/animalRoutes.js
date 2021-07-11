const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();

// route that front-end can request data from
router.get('/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// route for one specific animal instead of array 
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// app object method post listens for POST requests
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be 
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        // req.body is where our incoming content will be
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);        
    }
});

// send access to routes
module.exports = router;

