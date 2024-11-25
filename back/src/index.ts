import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { existeDir } from './utils/utils';
import networkRoutes from './routes/network.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para CORS
app.use(cors());

// Rutas
app.use("/api/network", networkRoutes);



const PORT = 3333;

const DIR_BASE = path.join(__dirname, '..', 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');

app.delete('network/delete/:id', async (req: Request, res: Response) => {

    const { id } = req.params;
    const pathNetwork = path.join(DIR_NETWORKS, id);

    if (existeDir(pathNetwork)) {

        // Borramos contenedores de Docker
        const dockerComposePath = path.join(pathNetwork, 'docker-compose.yml');
        execSync(`docker-compose -f ${dockerComposePath} down`);

        // Borramos directorio de la red
        fs.rmdirSync(pathNetwork, { recursive: true });

        // Borramos la red de network.json
        const networksDB = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'networks.json')).toString());
        const networksDBUpdated = networksDB.filter((network: any) => network.id !== id);
        fs.writeFileSync(path.join(DIR_BASE, 'networks.json'), JSON.stringify(networksDBUpdated, null, 4));

        res.status(204).send();

    } else {
        res.status(404).send(`No se ha encontrado la red ${id}`);
    }
});

// Middleware de manejo de errores (global)
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
