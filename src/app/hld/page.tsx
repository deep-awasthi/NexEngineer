import { Metadata } from "next";
import TopicPage from "@/components/TopicPage";
import { pageData } from "@/data/hld";

export const metadata: Metadata = {
  title: pageData.title + " Roadmap",
  description: pageData.description,
};

export default function Page() {
  return <TopicPage data={pageData} />;
}