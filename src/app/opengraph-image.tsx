import { ImageResponse } from "next/og";

export const alt =
  "Sideline Mentality Cards — Premium Sports Trading Cards";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #050505 0%, #171717 60%, #052e16 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
          padding: "70px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "730px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "84px",
                  height: "84px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "20px",
                  background: "#22c55e",
                  color: "#050505",
                  fontSize: "34px",
                  fontWeight: 900,
                }}
              >
                SM
              </div>

              <div
                style={{
                  marginLeft: "24px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "30px",
                    fontWeight: 900,
                  }}
                >
                  SIDELINE MENTALITY
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: "7px",
                    fontSize: "18px",
                    fontWeight: 800,
                    letterSpacing: "7px",
                    color: "#4ade80",
                  }}
                >
                  CARDS
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "42px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "68px",
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: "-3px",
                }}
              >
                Premium Sports
              </div>

              <div
                style={{
                  display: "flex",
                  fontSize: "68px",
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: "-3px",
                }}
              >
                Trading Cards
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "28px",
                fontSize: "24px",
                lineHeight: 1.4,
                color: "#d4d4d4",
              }}
            >
              Rookies, autographs, graded cards, stars, and legends.
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "42px",
                fontSize: "18px",
                fontWeight: 700,
                color: "#86efac",
              }}
            >
              Collector Owned • Secure Checkout • Fast Shipping
            </div>
          </div>

          <div
            style={{
              width: "300px",
              height: "390px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "30px",
              border: "4px solid #4ade80",
              background:
                "linear-gradient(145deg, #0a0a0a 0%, #14532d 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "80px",
                }}
              >
                ★
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "3px",
                }}
              >
                BUILT FOR
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "6px",
                  fontSize: "22px",
                  fontWeight: 900,
                  letterSpacing: "3px",
                  color: "#4ade80",
                }}
              >
                COLLECTORS
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}