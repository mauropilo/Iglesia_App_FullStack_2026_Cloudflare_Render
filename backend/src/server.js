import { app } from "./app.js";
import { env, validarConfiguracion } from "./config/env.js";

validarConfiguracion();
app.listen(env.port, () => console.log(`API disponible en http://localhost:${env.port}`));
