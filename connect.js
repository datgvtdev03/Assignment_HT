const mongoose = require('mongoose')
    const url = "mongodb://localhost:27017/Assignment_ManagerStore";

async function connect() {
    try {
        mongoose.connect(url)
            .then(() => console.log('Connected!'));
    } catch (error) {
        console.log('false');
    }
}
module.exports = { connect };