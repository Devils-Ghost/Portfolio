import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Route segment config
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  // Read the local font file using Node's fs module instead of fetch
  const interBold = readFileSync(join(process.cwd(), "src/app/Inter-Bold.ttf"));

  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: "black",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        fontFamily: "Inter",
      }}
    >
      D
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 900,
        },
      ],
    },
  );
}
