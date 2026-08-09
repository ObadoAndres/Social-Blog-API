import { app, startApp } from "./app.js";

const PORT = process.env.PORT || 3000;

const bootServer = async () => {
  try {
    await startApp();

    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

bootServer();