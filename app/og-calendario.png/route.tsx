import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casacusia.org";

export async function GET() {
  const imgUrl = `${SITE_URL}/images/og/grupal-casacusia.jpg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={imgUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 60px",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 50,
              fontWeight: 900,
              color: "white",
              lineHeight: 1.2,
              maxWidth: 900,
              fontFamily: "system-ui, sans-serif",
              textShadow: "0 3px 20px rgba(0,0,0,0.6)",
            }}
          >
            Hacé clic y conocé nuestro calendario de programas.
          </div>
          <div
            style={{
              fontSize: 50,
              fontWeight: 900,
              color: "#FFC001",
              lineHeight: 1.2,
              fontFamily: "system-ui, sans-serif",
              textShadow: "0 3px 20px rgba(0,0,0,0.6)",
            }}
          >
            ¡Te esperamos!
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
