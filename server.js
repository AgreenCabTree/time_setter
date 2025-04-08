const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
const port = 8080;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('combined'));

// Endpoint to serve the current time
app.get('/time', (req, res) => {
    const format = req.query.format || 'iso'; // Default to ISO format
    let time;

    switch (format) {
        case 'unix':
            time = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
            break;
        case 'iso':
        default:
            time = new Date().toISOString();
            break;
    }

    res.json({ time });
});

// Start the server
app.listen(port, () => {
    console.log(`Time server running at http://localhost:${port}`);
});