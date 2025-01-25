import { getHighlighter } from "@shikijs/compat";
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
import { Element } from "hast";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { codeImport } from "remark-code-import";
import remarkGfm from "remark-gfm";
import { Plugin } from "unified";

const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `post/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    published: { type: "boolean", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" } },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => {
        console.log("doc is ", doc);
        return doc._raw.flattenedPath;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm, codeImport],
    rehypePlugins: [
      rehypeSlug as Plugin,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          getHighlighter,
          onVisitLine(node: Element) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: Element) {
            if (Array.isArray(node.properties.className)) {
              node.properties.className.push("line--highlighted");
            } else {
              node.properties.className = ["line--highlighted"];
            }
          },
          onVisitHighlightedWord(node: Element) {
            if (Array.isArray(node.properties.className)) {
              node.properties.className = ["word--highlighted"];
            } else {
              node.properties.className = ["word--highlighted"];
            }
          },
        },
      ],
      [
        rehypeAutolinkHeadings as Plugin,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
