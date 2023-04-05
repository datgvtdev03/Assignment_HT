const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars')
const port = process.env.PORT || 8080;
const app = express();
const userController = require('./controllers/userController')


app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());
app.engine('.hbs', expressHbs.engine({ extname: "hbs", defaultLayout: 'main', layoutsDir: "views/layouts/" }));
app.set('view engine', '.hbs');
app.set('views', './views');
app.use(express.json());
//conect mongodb
const dbConect = require('./connect')
dbConect.connect();

app.use('/user', userController)

app.listen(port, () => {
  console.log("Localhost lang nghe cong " + port)
});

