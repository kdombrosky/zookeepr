// require data 
const { animals } = require('./data/animals');
// require npm express package
const express = require('express');
// set environment to use port if it has been set, and if not default to 80
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

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


function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
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


// method for server to listen to open port at 3001 
app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});



// "npm start" to run in terminal