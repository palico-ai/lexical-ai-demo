import { $createParagraphNode, $createTextNode, LexicalNode } from "lexical";
import { ContentNode, ContentType } from "../steps/preview/lexical_preview_content";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { useCallback } from "react";

export const useParseContentNode = () => {
  const parse = useCallback((content: ContentNode[]): LexicalNode[] => {
    const nodes: LexicalNode[] = [];
    content.forEach((node) => {
      switch (node.type) {
        case ContentType.Heading1:
          const heading = $createHeadingNode("h1");
          heading.append($createTextNode(node.value));
          nodes.push(heading);
          break;
        case ContentType.Heading2:
          const heading2 = $createHeadingNode("h2");
          heading2.append($createTextNode(node.value));
          nodes.push(heading2);
          break;
        case ContentType.Heading3:
          const heading3 = $createHeadingNode("h3");
          heading3.append($createTextNode(node.value));
          nodes.push(heading3);
          break;
        case ContentType.Paragraph:
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(node.value));
          nodes.push(paragraph);
          break;
        default:
          console.error("Unknown content type: ", node.type)
          const entry = $createParagraphNode();
          entry.append($createTextNode(node.value));
          nodes.push(entry);
      }
    });
    return nodes;
  }, []);

  return parse;
};
