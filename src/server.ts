import app from "./app";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Smart Home API",
      version: "1.0.0",
      description: "Documentation for Smart Home API endpoints",
    },
    servers: [
      {
        url: "https://api-echo.pollak.info",
      },
    ],
  },
  apis: [path.resolve(__dirname, "./routes/*.ts"), path.resolve(__dirname, "./routes/*.js")],
};

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
