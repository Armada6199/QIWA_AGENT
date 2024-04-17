"use client";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  HeroContent,
  HeroDescription,
  HeroTitle,
  MaxWidthContainer,
  SectionHeader,
} from "../components/HeroText";
import { handleExtractChatbotText } from "../finalSign/page";
const webChatOptions = {
  integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID, // The ID of this integration.
  region: process.env.NEXT_PUBLIC_REGION, // The region your integration is hosted in.
  serviceInstanceID: process.env.SERVICE_INSTANCE_ID, // The ID
};
function page() {
  const [instance, setInstance] = useState(null);
  const [voiceResponse, setVoiceResponse] = useState(null);
  const headers = {
    "Content-Type": "application/json",
  };

  useEffect(() => {
    instance?.on({
      type: "receive",
      handler: async (e) => {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/text-to-speech`,
          `${handleExtractChatbotText(e)}`,
          { headers: headers, responseType: "blob" }
        );
        const sourceData = URL.createObjectURL(response.data);
        console.log(sourceData);
        setVoiceResponse(sourceData);
      },
    });
  }, [instance]);
  return (
    <Grid
      container
      item
      sx={{ height: "calc(100vh - 160px)" }}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      gap={8}
    >
      <HeroContent>
        <SectionHeader>
          <HeroTitle data-aos="zoom-y-out">
            Turn Text Into <span>Speech</span>
          </HeroTitle>
          <HeroDescription data-aos="zoom-y-out" data-aos-delay="150">
            Speech will appear here once loaded
          </HeroDescription>
          <MaxWidthContainer data-aos="zoom-y-out" data-aos-delay="300">
            <Grid item>
              {voiceResponse && (
                <audio src={voiceResponse} controls>
                  test
                </audio>
              )}
            </Grid>
          </MaxWidthContainer>
        </SectionHeader>
      </HeroContent>

      <WebChatContainer config={webChatOptions} onBeforeRender={setInstance} />
    </Grid>
  );
}

export default page;
