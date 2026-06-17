import { Metadata } from "next";
import TopicPage from "@/components/TopicPage";
import { pageData } from "@/data/docker";

export const metadata: Metadata = {
  title: pageData.title + " Roadmap",
  description: pageData.description,
};

export default function Page() {
  return <TopicPage data={pageData} />;
}