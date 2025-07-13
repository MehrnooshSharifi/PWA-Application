import Head from "next/head";
import { useEffect } from "react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }) {
  // Register service worker on load
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js") // Pointing to your custom service worker
          .then((registration) => {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
            // Listen for updates to the service worker
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                      // New update available
                      console.log("New content is available; please refresh.");
                      // Optionally, prompt the user to refresh the page
                    } else {
                      // Content is cached for offline use
                      console.log("Content is cached for offline use.");
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, []);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        // Notify the user or reload the page
        window.location.reload();
      });
    }
  }, []);
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            width: "338px",
            height: "48px",
            fontSize: "14px",
          },
        }}
      />
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
