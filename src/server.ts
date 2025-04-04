import app from "./app";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
// Import your routes file to ensure it's available for Swagger
import "./routes/smartHomeRoutes";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Home API",
      version: "1.0.0",
      description: "Documentation for Smart Home API endpoints",
    },
    servers: [
      {
        url: "https://api-echo.pollak.info/smart",
        description: "Production server"
      },
      {
        url: "http://localhost:5000",
        description: "Development server"
      }
    ],
  },
  apis: [
    // Use both compiled and source files to ensure they're found
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "../src/routes/*.ts")
  ],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
