import HomePage from "../../components/home-page";
import { getHomePageContent, getPageMetadata, getStructuredData } from "../i18n/server";

export async function generateMetadata() {
  return getPageMetadata("zh-CN");
}

export default async function ZhCnPage() {
  const [content, structuredData] = await Promise.all([
    getHomePageContent("zh-CN"),
    getStructuredData("zh-CN"),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage content={content} />
    </>
  );
}
