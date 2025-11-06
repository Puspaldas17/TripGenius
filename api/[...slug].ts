import { createServer } from "../server";

// Catch-all API function: handles all /api/* routes.
// Vercel's Node runtime will invoke this for any subpath under /api.
export default createServer();
