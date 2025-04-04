import app from "./app";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", // Use 3.0.0 for better compatibility
    info: {
      title: "Smart Home API",
      version: "1.0.0",
      description: "Documentation for Smart Home API endpoints",
    },
    servers: [
      {
        url: "https://api-echo.pollak.info",
        description: "Production server"
      },
    ],
  },
  apis: [path.resolve(__dirname, "./routes/*.ts"), path.resolve(__dirname, "./routes/*.js")], // Include both TS and JS files
};


const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
