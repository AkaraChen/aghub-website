import Script from "next/script";
import HomePage from "../components/home-page";
import { getHomePageContent, getPageMetadata, getStructuredData } from "./i18n/server";

export async function generateMetadata() {
  return getPageMetadata("en");
}

export default async function Page() {
  const [content, structuredData] = await Promise.all([
    getHomePageContent("en"),
    getStructuredData("en"),
  ]);

  return (
    <>
      <Script id="locale-redirect" strategy="beforeInteractive">
        {`(function(){try{if(window.location.pathname!=="/")return;var langs=window.navigator.languages||[window.navigator.language||""];var prefersZh=langs.some(function(lang){var value=(lang||"").toLowerCase();return value==="zh"||value.indexOf("zh-")===0;});if(prefersZh){window.location.replace("/zh-cn"+window.location.search+window.location.hash);}}catch(error){}})();`}
      </Script>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage content={content} />
    </>
  );
}
