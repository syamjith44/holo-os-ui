import { useEffect } from "react";
import DesktopEnvironment from "@/components/desktop/DesktopEnvironment";

export default function Desktop() {
  useEffect(() => {
    // Set document title
    document.title = "Holographic OS - Web Desktop Environment";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A futuristic holographic web-based operating system with voice-enabled chatbot, interactive navigation, and real-time communications.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'A futuristic holographic web-based operating system with voice-enabled chatbot, interactive navigation, and real-time communications.';
      document.head.appendChild(meta);
    }
  }, []);

  return <DesktopEnvironment />;
}
