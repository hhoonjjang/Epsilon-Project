import { NextSeo } from "next-seo";

const SeoIndex = ({ title }: { title: string }) => {
  return <NextSeo title={title} />;
};

export default SeoIndex;
