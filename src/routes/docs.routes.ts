import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const router = Router();

/**
 * GET /docs
 * Sirve la documentación interactiva usando Redoc
 */
router.get('/', (_req: Request, res: Response) => {
  const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>PlaceToPay Integration API - Documentación</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='/docs/openapi.yaml'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
  `;
  res.send(html);
});

/**
 * GET /docs/openapi.yaml
 * Sirve el archivo OpenAPI spec
 */
router.get('/openapi.yaml', (_req: Request, res: Response) => {
  try {
    const openapiPath = path.join(__dirname, '../../openapi.yaml');
    const fileContents = fs.readFileSync(openapiPath, 'utf8');
    res.type('application/yaml').send(fileContents);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar especificación OpenAPI' });
  }
});

/**
 * GET /docs/openapi.json
 * Sirve el archivo OpenAPI spec en formato JSON
 */
router.get('/openapi.json', (_req: Request, res: Response) => {
  try {
    const openapiPath = path.join(__dirname, '../../openapi.yaml');
    const fileContents = fs.readFileSync(openapiPath, 'utf8');
    const data = yaml.load(fileContents);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar especificación OpenAPI' });
  }
});

export default router;
