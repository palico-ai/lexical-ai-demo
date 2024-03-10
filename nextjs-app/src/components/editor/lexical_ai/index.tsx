"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";

export const OPEN_ASK_AI_COMMAND = createCommand("palico-ai/open-ask-ai");
export const CLOSE_ASK_AI_COMMAND = createCommand("palico-ai/close-ask-ai");
import { mergeRegister } from "@lexical/utils";
import { LexicalAITypeahead } from "./typeahead";
import { useHotkeys } from "react-hotkeys-hook";
import { LexicalAITypeaheadProvider } from "./typeahead.context";
import { AIAction } from "./types";

export type ElementAbsoluteCoordinate = { x: number; y: number };

export type LexicalAIPluginProps = {
  options: AIAction[];
};

export const LexicalAIPlugin: React.FC<LexicalAIPluginProps> = ({
  options,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);

  useHotkeys(
    "ctrl+i",
    () => {
      handleOpenAskAI();
    },
    [editor],
    { enableOnContentEditable: true }
  );

  const handleOpenAskAI = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        OPEN_ASK_AI_COMMAND,
        () => {
          console.log("Open Ask AI Command");
          handleOpenAskAI();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        CLOSE_ASK_AI_COMMAND,
        () => {
          handleClose();
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, handleClose, handleOpenAskAI]);

  return (
    <LexicalAITypeaheadProvider
      actions={options}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <LexicalAITypeahead
        editor={editor}
        options={options}
        onClose={handleClose}
      />
    </LexicalAITypeaheadProvider>
  );
};