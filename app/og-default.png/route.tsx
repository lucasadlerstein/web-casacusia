import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FFF9F2 0%, #ffffff 50%, #f0fdf7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(0, 185, 128, 0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(86, 58, 179, 0.06)",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#143642",
            }}
          >
            CASACUSIA
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: "#143642",
              opacity: 0.7,
              maxWidth: 600,
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Trabajamos para las personas, no para los oídos.
          </div>
          <div
            style={{
              marginTop: 16,
              width: 60,
              height: 4,
              borderRadius: 2,
              background: "#00B980",
            }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#00B980",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
            }}
          >
            casacusia.org
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
