//This is assginment 2 submitted for course 4ME304

//creating express app
const express = require ('express');
const config = require('config');


const app = express();
app.use(express.json());


//creating the controller, so that they initialize requried maps at start of application 
const createStream = require('./controllers/twitterController');
const waves = require('./controllers/waves');
const neutrino = require('./controllers/nutrino');



// import the routes
const TwitterSentimentsRoutes = require('./routes/twitterController'); 
const dataProcessRoutes = require('./routes/dataProcess'); 
const wavesRoutes = require('./routes/waves');  
const neutrinoRoutes = require('./routes/nutrino');  


//setting the base routes paths
app.use('/', TwitterSentimentsRoutes);
app.use('/Calculate', dataProcessRoutes); 
app.use('/waves', wavesRoutes);
app.use('/neutrino', neutrinoRoutes);


//starting the app
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})


    
