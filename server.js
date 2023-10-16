const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED Rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
