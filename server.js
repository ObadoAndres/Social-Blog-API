import { existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { app, startApp } from './app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const envFile = process.env.DOTENV_CONFIG_PATH
  || (process.env.NODE_ENV === 'production' ? '.env.docker' : '.env.local');

const envPath = resolve(__dirname, envFile);

if (existsSync(envPath)) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: envPath });
} else if (existsSync(resolve(__dirname, '.env'))) {
  const dotenv = await import('dotenv');
  dotenv.config({ path: resolve(__dirname, '.env') });
}

const PORT = process.env.PORT || 3000;

// Initialize dependencies and boot server
const bootServer = async () => {
  try {
    await startApp();
   

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

bootServer();
