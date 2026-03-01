import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TripGenius API",
      version: "1.0.0",
      description: "API documentation for the TripGenius AI Trip Planner",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development Server",
      },
      {
        url: "http://localhost:3000",
        description: "Production Server",
      },
    ],
  },
  // Look for swagger JSDoc comments in these files
  apis: ["./server/routes/*.ts", "./server/index.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // Serve the Swagger UI at /api/docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Expose the raw swagger.json
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
