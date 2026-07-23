import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  
  type OrderItem = {
    playerName: string;
    year: number | null;
    brand: string | null;
    quantity: number;
    price: number;
  };
  
  type ShippingAddress = {
    line1: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
  };
  
  type Props = {
    customerName: string;
    orderNumber: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shippingCost: number;
    total: number;
  };
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }
  
  export default function OrderConfirmationEmail({
    customerName,
    orderNumber,
    items,
    shippingAddress,
    subtotal,
    shippingCost,
    total,
  }: Props) {
    const hasShippingAddress = Boolean(
      shippingAddress.line1 ||
        shippingAddress.city ||
        shippingAddress.state ||
        shippingAddress.zipCode,
    );
  
    return (
      <Html>
        <Head />
  
        <Preview>
          Your Sideline Mentality Cards order has been confirmed.
        </Preview>
  
        <Body
          style={{
            backgroundColor: "#0a0a0a",
            fontFamily: "Arial, Helvetica, sans-serif",
            margin: "0",
            padding: "40px 12px",
          }}
        >
          <Container
            style={{
              backgroundColor: "#171717",
              border: "1px solid #303030",
              borderRadius: "16px",
              maxWidth: "600px",
              overflow: "hidden",
            }}
          >
            <Section
              style={{
                backgroundColor: "#050505",
                borderBottom: "4px solid #22c55e",
                padding: "32px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "#22c55e",
                  fontSize: "13px",
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  margin: "0 0 12px",
                }}
              >
                SIDELINE MENTALITY CARDS
              </Text>
  
              <Heading
                style={{
                  color: "#ffffff",
                  fontSize: "30px",
                  lineHeight: "38px",
                  margin: "0",
                }}
              >
                Order Confirmed
              </Heading>
            </Section>
  
            <Section style={{ padding: "32px" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: "17px",
                  margin: "0 0 16px",
                }}
              >
                Hi {customerName},
              </Text>
  
              <Text
                style={{
                  color: "#d4d4d4",
                  fontSize: "16px",
                  lineHeight: "26px",
                  margin: "0",
                }}
              >
                Thank you for your purchase. We received your order and
                are getting your cards packed and ready to ship.
              </Text>
  
              <Section
                style={{
                  backgroundColor: "#222222",
                  border: "1px solid #333333",
                  borderRadius: "12px",
                  margin: "28px 0",
                  padding: "20px",
                }}
              >
                <Text
                  style={{
                    color: "#22c55e",
                    fontSize: "12px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    margin: "0 0 8px",
                    textTransform: "uppercase",
                  }}
                >
                  Order Number
                </Text>
  
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: "15px",
                    margin: "0",
                    wordBreak: "break-all",
                  }}
                >
                  {orderNumber}
                </Text>
              </Section>
  
              <Heading
                as="h2"
                style={{
                  color: "#ffffff",
                  fontSize: "20px",
                  margin: "0 0 16px",
                }}
              >
                Your Order
              </Heading>
  
              {items.map((item, index) => (
                <Section
                  key={`${item.playerName}-${index}`}
                  style={{
                    borderBottom: "1px solid #333333",
                    padding: "16px 0",
                  }}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 0 6px",
                    }}
                  >
                    {item.playerName}
                  </Text>
  
                  <Text
                    style={{
                      color: "#a3a3a3",
                      fontSize: "14px",
                      margin: "0 0 8px",
                    }}
                  >
                    {[item.year, item.brand].filter(Boolean).join(" • ") ||
                      "Sports Card"}
                  </Text>
  
                  <Text
                    style={{
                      color: "#d4d4d4",
                      fontSize: "14px",
                      margin: "0",
                    }}
                  >
                    Quantity: {item.quantity}
                    {"  •  "}
                    {formatCurrency(item.price * item.quantity)}
                  </Text>
                </Section>
              ))}
  
              <Section
                style={{
                  backgroundColor: "#222222",
                  borderRadius: "12px",
                  margin: "28px 0",
                  padding: "20px",
                }}
              >
                <Text
                  style={{
                    color: "#d4d4d4",
                    fontSize: "15px",
                    margin: "0 0 12px",
                  }}
                >
                  Subtotal:{" "}
                  <strong style={{ color: "#ffffff" }}>
                    {formatCurrency(subtotal)}
                  </strong>
                </Text>
  
                <Text
                  style={{
                    color: "#d4d4d4",
                    fontSize: "15px",
                    margin: "0 0 16px",
                  }}
                >
                  Shipping:{" "}
                  <strong style={{ color: "#ffffff" }}>
                    {formatCurrency(shippingCost)}
                  </strong>
                </Text>
  
                <Hr
                  style={{
                    borderColor: "#444444",
                    margin: "0 0 16px",
                  }}
                />
  
                <Text
                  style={{
                    color: "#22c55e",
                    fontSize: "22px",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  Total: {formatCurrency(total)}
                </Text>
              </Section>
  
              {hasShippingAddress ? (
                <Section
                  style={{
                    border: "1px solid #333333",
                    borderRadius: "12px",
                    marginBottom: "28px",
                    padding: "20px",
                  }}
                >
                  <Text
                    style={{
                      color: "#22c55e",
                      fontSize: "12px",
                      fontWeight: "bold",
                      letterSpacing: "2px",
                      margin: "0 0 12px",
                      textTransform: "uppercase",
                    }}
                  >
                    Shipping To
                  </Text>
  
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: "15px",
                      lineHeight: "24px",
                      margin: "0",
                    }}
                  >
                    {customerName}
                    <br />
                    {shippingAddress.line1}
                    <br />
                    {shippingAddress.city}
                    {shippingAddress.city &&
                    (shippingAddress.state || shippingAddress.zipCode)
                      ? ", "
                      : ""}
                    {shippingAddress.state} {shippingAddress.zipCode}
                  </Text>
                </Section>
              ) : null}
  
              <Text
                style={{
                  color: "#d4d4d4",
                  fontSize: "15px",
                  lineHeight: "24px",
                  margin: "0 0 24px",
                  textAlign: "center",
                }}
              >
                We’ll send another email as soon as your order ships.
              </Text>
  
              <Button
                href="https://sidelinementality.com/shop"
                style={{
                  backgroundColor: "#22c55e",
                  borderRadius: "10px",
                  color: "#000000",
                  display: "block",
                  fontSize: "15px",
                  fontWeight: "bold",
                  padding: "15px 24px",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Continue Shopping
              </Button>
  
              <Hr
                style={{
                  borderColor: "#333333",
                  margin: "36px 0 22px",
                }}
              />
  
              <Text
                style={{
                  color: "#737373",
                  fontSize: "13px",
                  lineHeight: "22px",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                Developing athletes.
                <br />
                Building leaders.
                <br />
                Impacting lives beyond the scoreboard.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }