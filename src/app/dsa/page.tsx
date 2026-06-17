import { Metadata } from "next";
import TopicPage from "@/components/TopicPage";
import { pageData } from "@/data/dsa";

export const metadata: Metadata = {
  title: pageData.title + " Roadmap",
  description: pageData.description,
};

export default function Page() {
  return <TopicPage data={pageData} />;
}