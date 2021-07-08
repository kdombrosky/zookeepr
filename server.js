const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');
const { resolveSoa } = require('dns');

// set environment to use port if it has been set, and if not default to 80
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();


// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));


// takes in req.query as an argument and filters through animals accordingly
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = []; 
    let filteredResults = animalsArray;

    if(query.personalityTraits) {
        // save personalityTraits as a dedicated array 
        // If personalityTraits is a string, place it into a new array and save
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array: 
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array. 
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if(query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


// function to return individual animal by its id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// create new animal from POST req and update the ./data/animals.json file
function createNewAnimal(body, animalsArray) {
    const animal = body; 
    animalsArray.push(animal);

    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
}


// validate post data 
function validateAnimal(animal) {
    if(!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}


// route that front-end can request data from
app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// route for one specific animal instead of array 
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// route to serve index.html (root route)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// route to serve animals.html
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// route to serve zookeepers.html
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// wildcard routes to reroute to homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// app object method post listens for POST requests
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be 
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        // req.body is where our incoming content will be
        res.json(req.body);        
    }
});


// method for server to listen to open port at 3001 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// "npm start" to run in terminal