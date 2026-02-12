"use client";

import { useEffect } from "react";

export default function XTimeline() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // optional cleanup
    };
  }, []);

  return (
    <a
      className="twitter-timeline"
      data-height="500"
      data-chrome="noheader nofooter noborders"
      href="https://twitter.com/mkule"
    >
      Tweets by mkule
    </a>
  );
}
