const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Team 16\'s API',
        description: 'This API was created by Team 16 to manage events.'
    },
    host: 'localhost:8080',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);