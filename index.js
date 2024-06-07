const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const connectDb = require("./database");
const morgan = require('morgan');
const bodyParser = require('body-parser');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const indexRoutes = require("./routes/index");

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))

app.use("/api", indexRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
  await connectDb();
});
