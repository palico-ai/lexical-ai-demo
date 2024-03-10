import React, { useMemo } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
} from "@mui/material";
import { ElementAbsoluteCoordinate } from "../..";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import LexicalPreviewContent, { ContentNode } from "./lexical_preview_content";
import { useHotkeys } from "react-hotkeys-hook";

function Placeholder() {
  return <div />;
}

interface RenderPreviewProps {
  content: ContentNode[];
  enableReplace: boolean;
  onSelectInsertBelow: () => void;
  onSelectReplace: () => void;
  onSelectCancel: () => void;
}

const editorConfig: InitialConfigType = {
  namespace: "",
  editable: false,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

const RenderPreview: React.FC<RenderPreviewProps> = ({
  content,
  onSelectInsertBelow: onSelectInsert,
  enableReplace,
  onSelectReplace,
  onSelectCancel,
}) => {
  const handleInsert = () => {
    onSelectInsert();
  };

  useHotkeys("enter", () => {
    onSelectInsert();
  });

  useHotkeys("shift+enter", () => {
    onSelectReplace();
  });

  return (
    <Dialog
      open={true}
      onClose={onSelectCancel}
      scroll="paper"
      maxWidth="md"
      fullWidth
    >
      <DialogContent>
        <LexicalComposer initialConfig={editorConfig}>
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<Placeholder />}
          />
          <LexicalPreviewContent content={content} />
        </LexicalComposer>
        <Divider sx={{ py: 1 }} />
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            p: 1,
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={onSelectCancel}
          >
            Cancel [Esc]
          </Button>
          {enableReplace && (
            <Button
              variant="contained"
              color="secondary"
              onClick={onSelectReplace}
            >
              Replace [Shift + Enter]
            </Button>
          )}
          <Button variant="contained" color="primary" onClick={handleInsert}>
            Insert [Enter]
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RenderPreview;
