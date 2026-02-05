"use client";

import Script from "next/script";

const Webchat = () => {
  return (
    <div>
      <Script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js" />
      <Script
        src="https://files.bpcontent.cloud/2026/02/05/20/20260205200052-KPUW20L1.js"
        defer
      />
    </div>
  );
};

export default Webchat
