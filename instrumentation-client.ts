import { initBotId } from "botid/client/core";

/**
 * BotID protege las rutas donde se invocan Server Actions con formularios
 * públicos. El path es el de la *página* desde la que se dispara la action,
 * no el del archivo de la action.
 *
 * El form de contacto se renderiza en /contacto y en /sumate/donar-servicios;
 * el de newsletter, en el home (vía la API route) y en el blog (server action).
 * Cada página existe también bajo el prefijo /en.
 */
initBotId({
  protect: [
    // Formulario de contacto
    { path: "/contacto", method: "POST" },
    { path: "/en/contacto", method: "POST" },
    { path: "/sumate/donar-servicios", method: "POST" },
    { path: "/en/sumate/donar-servicios", method: "POST" },
    // Newsletter del home: endpoint público, el más expuesto de todos
    { path: "/api/newsletter", method: "POST" },
    // Newsletter del blog: server action, en el listado y en cada nota
    { path: "/recursos/blog", method: "POST" },
    { path: "/recursos/blog/*", method: "POST" },
    { path: "/en/recursos/blog", method: "POST" },
    { path: "/en/recursos/blog/*", method: "POST" }
  ]
});
