import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const imgData = await readFile(join(process.cwd(), "public/images/og/grupal-casacusia.jpg"));
  const base64 = `data:image/jpeg;base64,${imgData.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src={base64} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "40px 60px", gap: 12 }}>
          <div style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1.2, maxWidth: 900, fontFamily: "system-ui, sans-serif", textShadow: "0 3px 20px rgba(0,0,0,0.6)" }}>
            CASACUSIA es la Casa de las Personas con Hipoacusia.
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, color: "#FFC001", lineHeight: 1.2, fontFamily: "system-ui, sans-serif", textShadow: "0 3px 20px rgba(0,0,0,0.6)" }}>
            ¿Te sumás?
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
