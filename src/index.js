import app from './express';
import config from './config/config';
import mongoose from 'mongoose';

// Connection URL
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoLink(), { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Server started on port ${config.port}`);
});
