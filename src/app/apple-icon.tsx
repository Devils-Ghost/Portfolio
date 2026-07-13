import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 32,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 140,
        fontWeight: 700,
        fontFamily: "sans-serif",
        color: "#ffffff",
      }}
    >
      D
    </div>,
    { ...size },
  );
}
