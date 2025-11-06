import { createServer } from "../server";

// Export the Express app directly. Vercel's Node runtime will invoke it as a handler
// for requests to /api/** via the rewrite in vercel.json.
export default createServer();
