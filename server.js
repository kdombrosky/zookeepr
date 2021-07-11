const express = require('express');
// set environment to use port if it has been set, and if not default to 80
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


// parse incoming string or array data (unencode form data) 
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// serve entire 'public' folder 
app.use(express.static('public'));
// or (foolproofing) 
// app.use(express.static(path.join(__dirname, "public")));


// to use the apiRoutes router if navigated to <ourhost>/api
app.use('/api', apiRoutes);
// to use the htmlRoutes router if navigated to <ourhost>/
app.use('/', htmlRoutes);


// method for server to listen to open port at 3001 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// "npm start" to run in terminal