import app from './express';
import config from './config/config';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

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

app.use('/', userRoutes);
app.use('/', authRoutes);

app.server = app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info(`Server started on port ${config.port}`);
});

export default app;
