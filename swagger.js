const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Team 16\'s API',
        description: 'This API was created by Team 16 to manage events.'
    },
    host: 'cse341-team16.onrender.com',
    schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);