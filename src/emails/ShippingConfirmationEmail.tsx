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
  
  type Props = {
    customerName: string;
    orderNumber: string;
    trackingNumber: string;
    trackingUrl: string;
  };
  
  export default function ShippingConfirmationEmail({
    customerName,
    orderNumber,
    trackingNumber,
    trackingUrl,
  }: Props) {
    return (
      <Html>
        <Head />
  
        <Preview>
          Your Sideline Mentality Cards order has shipped!
        </Preview>
  
        <Body
          style={{
            backgroundColor: "#0a0a0a",
            fontFamily: "Arial, Helvetica, sans-serif",
            padding: "40px 12px",
          }}
        >
          <Container
            style={{
              backgroundColor: "#171717",
              border: "1px solid #303030",
              borderRadius: "16px",
              overflow: "hidden",
              maxWidth: "600px",
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
                  fontWeight: "bold",
                  letterSpacing: "3px",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                SIDELINE MENTALITY CARDS
              </Text>
  
              <Heading
                style={{
                  color: "#ffffff",
                  marginTop: "14px",
                  marginBottom: 0,
                  fontSize: "30px",
                }}
              >
                Your Order Has Shipped!
              </Heading>
            </Section>
  
            <Section style={{ padding: "32px" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: "17px",
                }}
              >
                Hi {customerName},
              </Text>
  
              <Text
                style={{
                  color: "#d4d4d4",
                  lineHeight: "26px",
                  fontSize: "16px",
                }}
              >
                Great news! Your order is on its way.
              </Text>
  
              <Section
                style={{
                  backgroundColor: "#222222",
                  borderRadius: "12px",
                  padding: "20px",
                  margin: "28px 0",
                }}
              >
                <Text style={{ color: "#22c55e", margin: 0 }}>
                  Order Number
                </Text>
  
                <Text style={{ color: "#ffffff" }}>
                  {orderNumber}
                </Text>
  
                <Hr style={{ borderColor: "#444444" }} />
  
                <Text style={{ color: "#22c55e", margin: 0 }}>
                  Tracking Number
                </Text>
  
                <Text style={{ color: "#ffffff" }}>
                  {trackingNumber}
                </Text>
              </Section>
  
              <Button
                href={trackingUrl}
                style={{
                  display: "block",
                  backgroundColor: "#22c55e",
                  color: "#000000",
                  textDecoration: "none",
                  fontWeight: "bold",
                  textAlign: "center",
                  padding: "16px",
                  borderRadius: "10px",
                }}
              >
                Track Your Package
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
                  textAlign: "center",
                  lineHeight: "22px",
                  fontSize: "13px",
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