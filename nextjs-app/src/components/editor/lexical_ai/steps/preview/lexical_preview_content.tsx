import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import React from 'react'
import { useParseContentNode } from '../../utils/use_content_node_parser';

export enum ContentType {
  Heading1 = "heading1",
  Heading2 = "heading2",
  Heading3 = "heading3",
  Paragraph = "paragraph",
}

export interface ContentNode {
  type: ContentType;
  value: string;
}

export interface LexicalPreviewContentProps {
  content: ContentNode[];
}

const LexicalPreviewContent : React.FC<LexicalPreviewContentProps> = ({
  content,
}) => {
  const [editor] = useLexicalComposerContext();
  const parseContentNode = useParseContentNode()

  React.useEffect(() => {
    const updatePreview = async () => {
      editor.update(() => {
        const nodes = parseContentNode(content);
        const root = $getRoot();
        root.clear()
        root.append(...nodes);
      });
    }
    void updatePreview();
  }, [content, editor, parseContentNode]);

  return <></>
}

export default LexicalPreviewContent