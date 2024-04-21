"use client";
import { glassmorphismStyle } from "@/styles/styles";
import { WebChatContainer } from "@ibm-watson/assistant-web-chat-react";
import ChatIcon from "@mui/icons-material/Chat";
import MicIcon from "@mui/icons-material/Mic";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import SignLanguageIcon from "@mui/icons-material/SignLanguage";
import VideocamIcon from "@mui/icons-material/Videocam";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { Grid, Modal, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FeaturesHOC from "./components/FeaturesHOC.jsx";

const HeroSection = styled("section")({
  position: "relative",
  height: "calc(100vh - 120px)",
  width: "100%",
});

export const IllustrationContainer = styled("div")({
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  bottom: 0,
  pointerEvents: "none",
  zIndex: -1,
});
const webChatOptions = {
  integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID,
  region: process.env.NEXT_PUBLIC_REGION,
  serviceInstanceID: process.env.SERVICE_INSTANCE_ID,
};
const Hero = () => {
  const router = useRouter();
  const [instance, setInstance] = useState(null);

  const [open, setOpen] = React.useState({
    speechToText: false,
    videoToText: false,
    textToSign: false,
    textToSpeech: false,
  });

  const handleOpen = (text) => {
    setOpen((prev) => ({ ...prev, [text]: true }));
    setActiveFeature(text);
  };
  const handleClose = () => {
    setOpen((prev) => ({ ...prev, [activeFeature]: false }));
  };

  const [activeFeature, setActiveFeature] = useState("");
  useEffect(() => {
    instance?.on({
      type: "customResponse",
      handler: (event, instance) => {
        console.log("handled");
        if (
          event.data.message.user_defined &&
          event.data.message.user_defined.user_defined_type ===
            "user-file-upload"
        ) {
          fileUploadCustomResponseHandler(event, instance);
        }
      },
    });
    instance?.on({
      type: "receive",
      handler: (e) => {
        console.log(e.data.output.generic[0].text);
      },
    });
    instance?.updateCSSVariables();
  }, [instance]);
  function fileUploadCustomResponseHandler(event, instance) {
    const { element } = event.data;
    element.innerHTML = `
          <div>
              <input type="file" id="uploadInput" style="display: none;">
              <button id="uploadButton" class="WAC__button--primary WAC__button--primaryMd" style="margin-top: 10px;cursor:pointer; color:#fff;border-radius:10px;padding:10px;background-color:#0C2643"> Upload a File </button>
          </div>`;

    const uploadInput = element.querySelector("#uploadInput");
    const button = element.querySelector("#uploadButton");
    button.addEventListener("click", () => {
      uploadInput.click();
    });
    uploadInput.addEventListener("change", (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        // You can access the selected file using selectedFile variable
        // console.log("Selected file:", selectedFile.name);
        // uploadFileFromAsst(selectedFile);
        console.log(selectedFile);
        var send_obj = { input: { message_type: "text", text: "" } };

        instance.send(send_obj, { silent: true }).catch(function (error) {
          console.error("Sending message to chatbot failed");
        });
      }
    });
  }
  return (
    <Grid container item height={"calc(100vh - 60px)"} p={4} gap={4}>
      <HeroSection>
        <IllustrationContainer aria-hidden="true">
          <svg
            width="100vw"
            height="100vh"
            viewBox="0 0 1360 578"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="100%"
                id="illustration-01"
              >
                <stop stopColor="#8bab9a" offset="0%" />
                <stop stopColor="#45785d" offset="77.402%" />
                <stop stopColor="#165634" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="url(#illustration-01)" fillRule="evenodd">
              <circle cx="100%" cy="80" r="128" />
              <circle cx="155" cy="443" r="64" />
            </g>
          </svg>
        </IllustrationContainer>

        <Grid container item justifyContent={"center"} mt={4}>
          <Grid container item xs={12} md={8} gap={4} justifyContent={"center"}>
            <Grid
              container
              item
              sx={{
                ...glassmorphismStyle,
                cursor: "pointer",
                textAlign: "center",
                bgcolor: activeFeature === "textToSpeech" ? "primary.main" : "",
                color:
                  activeFeature === "textToSpeech" ? "#fff" : "primary.main",
                transition: "all .5s ease-in-out",
              }}
              onClick={() => router.push("texttospeech")}
              xs={12}
              md={3}
              gap={2}
              p={2}
            >
              <Grid item xs={12}>
                <ChatIcon sx={{ fontSize: 64 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Text To Speech</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              item
              sx={{
                ...glassmorphismStyle,
                cursor: "pointer",
                textAlign: "center",
                bgcolor: activeFeature === "speechtotext" ? "primary.main" : "",
                color:
                  activeFeature === "speechToText" ? "#fff" : "primary.main",
                transition: "all .5s ease-in-out",
              }}
              onClick={() => router.push("speechtotext")}
              xs={12}
              md={3}
              gap={2}
              p={2}
            >
              <Grid item xs={12}>
                <MicIcon
                  sx={{
                    fontSize: 64,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Speech To Text</Typography>
              </Grid>
            </Grid>
            <Grid
              container
              item
              sx={{
                ...glassmorphismStyle,
                cursor: "pointer",
                textAlign: "center",
                bgcolor:
                  activeFeature === "speechToSpeech" ? "primary.main" : "",
                color:
                  activeFeature === "speechToSpeech" ? "#fff" : "primary.main",
                transition: "all .5s ease-in-out",
              }}
              onClick={() => router.push("finalSpeech")}
              xs={12}
              md={3}
              gap={2}
              p={2}
            >
              <Grid item xs={12}>
                <RecordVoiceOverIcon sx={{ fontSize: 64 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5">Speech To Speech</Typography>
              </Grid>
            </Grid>
          </Grid>

          <Modal
            open={open[activeFeature] || false}
            onClose={handleClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              border: "none",
            }}
          >
            <Grid
              container
              item
              md={8}
              justifyContent={"center"}
              p={4}
              position={"relative"}
              sx={{
                outline: "none",
                border: "none",
              }}
            >
              <FeaturesHOC feature={activeFeature} handleClose={handleClose} />
              {/* <ClearSharp
                sx={{
                  position: "absolute",
                  top: 50,
                  right: 100,
                  fontSize: 68,
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              /> */}
            </Grid>
          </Modal>
        </Grid>
        {/* {Load_bot()} */}
        <WebChatContainer
          config={webChatOptions}
          onBeforeRender={setInstance}
        />
      </HeroSection>
    </Grid>
  );
};

export default Hero;
