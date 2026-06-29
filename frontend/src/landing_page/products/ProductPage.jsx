import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

export default function ProductPage() {
  return (
    <>
      <Hero />

      <LeftSection
        imageURL="media/images/kite.png"
        productName="Portfolio Dashboard"
        productDescription="A centralized dashboard that gives users a clear overview of holdings, available funds, portfolio value, and recent activity in one place."
        learnMore=""
      />

      <RightSection
        imageURL="media/images/console.png"
        productName="Investment Analytics"
        productDescription="Visualize portfolio performance, understand investment distribution, and review key portfolio metrics through clean reports and charts."
        learnMore=""
      />

      <LeftSection
        imageURL="media/images/coin.png"
        productName="Holdings Management"
        productDescription="Track current positions, quantities, average prices, current values, and profit or loss through an organized holdings module."
        learnMore=""
      />

      <RightSection
        imageURL="media/images/kiteconnect.svg"
        productName="Secure REST API Layer"
        productDescription="AlphaTrade uses a structured backend API layer with JWT authentication, protected routes, and MongoDB integration for secure data access."
        learnMore=""
      />

      <LeftSection
        imageURL="media/images/varsity.png"
        productName="Portfolio Learning"
        productDescription="Learn investment basics, portfolio allocation, diversification, and long-term financial planning through a simplified learning-focused experience."
        learnMore=""
      />

      <Universe />
    </>
  );
}