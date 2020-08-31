const open = require('open');
const express = require('express');
const app = express();

app.use('/node_modules', express.static('node_modules'));
app.use(express.static('public'));

const listener = app.listen(0, () => {
    const URL = `http://localhost:${listener.address().port}`;
    open(URL).then(() => {
        console.log(`Opened browser for ${URL}`);
    }).catch(error => {
        console.log(`Cannot open ${URL}: ${error}`);
    });
})