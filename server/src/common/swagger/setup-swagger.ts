import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/** OpenAPI docs. Mounted only outside production (see main.ts). */
export function setupSwagger(app: INestApplication, path = 'docs') {
  const config = new DocumentBuilder()
    .setTitle('Nexora OS API')
    .setDescription(
      'Multi-tenant business operations API.\n\n' +
        '- UUID v4 identifiers\n' +
        '- Organization-scoped data access\n' +
        '- Success envelope `{ success, message, data, meta }`; errors `{ statusCode, code, message, details, requestId }`',
    )
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document, {
    swaggerOptions: { persistAuthorization: true, displayRequestDuration: true, filter: true },
  });
}
