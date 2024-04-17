"use client";
function Load_bot() {
  window.watsonAssistantChatOptions = {
    integrationID: process.env.NEXT_PUBLIC_INTEGRATION_ID, // The ID of this integration.
    region: process.env.NEXT_PUBLIC_REGION, // The region your integration is hosted in.
    serviceInstanceID: process.env.SERVICE_INSTANCE_ID, // The ID of your service instance.
    onLoad: async (instance) => {
      await instance.render();
    },
  };
  setTimeout(function () {
    const t = document.createElement("script");
    t.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (window.watsonAssistantChatOptions.clientVersion || "latest") +
      "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  });
}
export default Load_bot;
