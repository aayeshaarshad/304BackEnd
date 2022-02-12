const express = require ('express');
const config = require('config');


const app = express();
app.use(express.json());

const createStream = require('./controllers/twitterController');
const waves = require('./controllers/waves');
const neutrino = require('./controllers/nutrino');

// app.use(function (req, res, next) {
//     // Assign the config to the req object
//     req.config = config;
//     // Call the next function in the pipeline (your controller actions).
//     return next();
//   });

// import the routes
const TwitterSentimentsRoutes = require('./routes/twitterController'); 
const dataProcessRoutes = require('./routes/dataProcess'); 
const wavesRoutes = require('./routes/waves');  
const neutrinoRoutes = require('./routes/nutrino');  


app.use('/', TwitterSentimentsRoutes);
app.use('/Calculate', dataProcessRoutes); 
app.use('/waves', wavesRoutes);
app.use('/neutrino', neutrinoRoutes);



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


    
