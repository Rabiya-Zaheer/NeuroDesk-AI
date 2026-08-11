import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
  return createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "NeuroDesk API",
        version: "0.1.0",
        description:
          "REST endpoints exposed by the NeuroDesk web app — currently the Chrome extension's session, workspace-listing, and capture endpoints. Session-cookie authenticated; see each endpoint for details.",
      },
      servers: [{ url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000" }],
      components: {
        securitySchemes: {
          sessionCookie: {
            type: "apiKey",
            in: "cookie",
            name: "neurodesk_session",
            description:
              "Set on login/signup. The Chrome extension sends this automatically via credentials: 'include' — there's no separate API token.",
          },
        },
      },
      security: [{ sessionCookie: [] }],
    },
  });
}