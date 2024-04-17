"use client";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import { Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
  HeroContent,
  HeroDescription,
  HeroTitle,
  MaxWidthContainer,
  SectionHeader,
} from "../components/HeroText";
import AudioRecorder from "../components/utils/VoiceRecorder";
const webChatOptions = {
  integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID, // The ID of this integration.
  region: process.env.NEXT_PUBLIC_REGION, // The region your integration is hosted in.
  serviceInstanceID: process.env.SERVICE_INSTANCE_ID, // The ID
  // subscriptionID: 'only on enterprise plans',
  // Note that there is no onLoad property here. The WebChatContainer component will override it.
  // Use the onBeforeRender or onAfterRender prop instead.
};
function page() {
  // const [instance, setInstance] = useState(null);
  const instanceRef = useRef(null);
  const [speechText, setSpeechText] = useState(null);
  const [instance, setInstance] = useState();

  useEffect(() => {
    if (instance) {
      instance.send(speechText);
    }
  }, [speechText]);

  return (
    <Grid container>
      <HeroContent>
        <SectionHeader>
          <HeroTitle data-aos="zoom-y-out">
            Turn Speech Into <span>TEXT</span>
          </HeroTitle>
          <HeroDescription data-aos="zoom-y-out" data-aos-delay="150">
            Once you are ready click on the button below to start recording
          </HeroDescription>
          <MaxWidthContainer data-aos="zoom-y-out" data-aos-delay="300">
            {/* Your additional content here */}
            <AudioRecorder
              speechText={speechText}
              setSpeechText={setSpeechText}
              // toggleWebChat={toggleWebChat}
            />
          </MaxWidthContainer>
        </SectionHeader>

        <WebChatContainer
          config={webChatOptions}
          onBeforeRender={setInstance}
        />
      </HeroContent>
    </Grid>
  );
}

export default page;
