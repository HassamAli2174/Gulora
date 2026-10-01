import serverless from 'serverless-http';
import { app } from '../../backend/src/app';

// Runs the Express API as a Netlify Function. /api/* is routed here by netlify.toml.
export const handler = serverless(app);
