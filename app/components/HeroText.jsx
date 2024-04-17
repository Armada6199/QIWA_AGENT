import styled from "@emotion/styled";

export const HeroContent = styled("div")({
  maxWidth: "6xl",
  margin: "auto",
  padding: "4rem 2rem",
});

export const SectionHeader = styled("div")({
  textAlign: "center",
  paddingBottom: "4rem",
});

export const HeroTitle = styled("h1")({
  fontSize: "2.5rem",
  "@media (min-width: 768px)": {
    fontSize: "3rem",
  },
  fontWeight: "bold",
  lineHeight: "1.2",
  marginBottom: "1rem",
  "& span": {
    backgroundClip: "text",
    color: "transparent",
    backgroundImage: "linear-gradient(to right, #165634, #165634)",
  },
});

export const HeroDescription = styled("p")({
  fontSize: "1.25rem",
  color: "#718096",
  marginBottom: "2rem",
});
export const MaxWidthContainer = styled("div")({
  maxWidth: "48rem",
  margin: "auto",
  "@media (min-width: 640px)": {
    display: "flex",
    justifyContent: "center",
    gap: 12,
  },
});
