import express from "express";
import cors from "cors";
import swaggerDocs from "./swaggerDocs.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

// Rutas de la API
app.use("/api/checkout", checkoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/session", sessionRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send(
    "El servidor está en funcionamiento. Puedes consultar la documentación de la API en /api-docs"
  );
});

// Swagger Docs
swaggerDocs(app);

// Iniciar servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
