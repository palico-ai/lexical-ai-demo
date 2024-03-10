import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useCallback, useContext, useMemo } from "react";
import PromptFreetext from "./steps/prompt_freetext";
import {
  getDefaultRequestParams,
  getRequestParamForAction,
  useQueryAgent,
} from "./utils/request";
import {
  $createLineBreakNode,
  $createNodeSelection,
  $getNodeByKey,
  $insertNodes,
} from "lexical";
import RenderPreview from "./steps/preview";
import { useParseContentNode } from "./utils/use_content_node_parser";
import { LexicalAITypeaheadContext, Step } from "./typeahead.context";
import PromptSelectAIAction, { OnSelectParams } from "./steps/select_action";
import { AIAction, AskAgentRequestParams } from "./types";

export type LexicalAITypeaheadProps = {
  onClose: () => void;
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  options: AIAction[];
};

export const LexicalAITypeahead: React.FC<LexicalAITypeaheadProps> = ({
  onClose,
}) => {
  const {
    isOpen,
    actions: options,
    selection,
    handleClose,
    setStepValue: setStepOutput,
    stepValue: stepOutput,
    setActiveStep: setStep,
    activeStep: step,
  } = useContext(LexicalAITypeaheadContext);
  const [editor] = useLexicalComposerContext();
  const { askAgent } = useQueryAgent({
    apiURL: "http://localhost:8000",
    serviceKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXBsb3ltZW50SWQiOi0xLCJpYXQiOjE3MDkzMzc2ODF9.VtDihjqMcviS37AsUJZSuIxrxNp5QXegmz26qf2QyK4",
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const parseContentNode = useParseContentNode();

  const callAgentAndShowPreview = useCallback(
    async (params: AskAgentRequestParams) => {
      const response = await askAgent(params.message, params.context);
      const content = response?.message.content;
      if (!content) {
        throw new Error("No content");
      }
      setStepOutput({
        ...stepOutput,
        [Step.PreviewGeneration]: JSON.parse(content as string),
      });
      setStep(Step.PreviewGeneration);
    },
    [askAgent, setStep, setStepOutput, stepOutput]
  );

  const handleSelectOption = useCallback(
    async (action: AIAction, params: OnSelectParams) => {
      if (action.promptForFreeText) {
        setStepOutput({
          ...stepOutput,
          [Step.SelectMenuItem]: {
            action,
            optionValue: params.selectedOptionValue,
          },
        });
        setStep(Step.AddFreeText);
        return;
      } else {
        const requestBody = getDefaultRequestParams({
          action,
          selectedOptionValue: params.selectedOptionValue,
          selectedText: selection?.rangeSelection?.selectedText,
        });
        await callAgentAndShowPreview(requestBody);
      }
    },
    [
      callAgentAndShowPreview,
      selection?.rangeSelection?.selectedText,
      setStep,
      setStepOutput,
      stepOutput,
    ]
  );

  const handleSubmitFreetext = useCallback(
    async (text: string) => {
      const selectedOption = stepOutput[Step.SelectMenuItem]!;
      try {
        const params = await getRequestParamForAction({
          action: selectedOption.action,
          selectedOptionValue: selectedOption.optionValue,
          freeText: text,
          selectedText: selection?.rangeSelection?.selectedText,
        });
        await callAgentAndShowPreview(params);
      } catch (error) {
        // TODO: Show Error
        console.error(error);
      }
    },
    [
      callAgentAndShowPreview,
      selection?.rangeSelection?.selectedText,
      stepOutput,
    ]
  );

  const handleInsertBelowSelection = useCallback(() => {
    editor.update(() => {
      const nodes = parseContentNode(stepOutput[Step.PreviewGeneration]!);
      const lastNode = $getNodeByKey(selection!.lastNodeKey);
      if (lastNode) {
        console.log("Inserting after", lastNode);
        lastNode.selectNext();
      }
      console.log("Inserting at the end");
      $insertNodes([
        $createLineBreakNode(),
        ...nodes,
      ]);
      onClose();
    });
  }, [editor, onClose, parseContentNode, selection, stepOutput]);

  const handleReplaceSelection = useCallback(() => {
    editor.update(() => {
      const rangeSelection = selection?.rangeSelection;
      if (!rangeSelection) {
        handleInsertBelowSelection();
        return
      }
      const nodeSelection = $createNodeSelection()
      rangeSelection.selectionKeys.forEach((key) => {
        nodeSelection.add(key)
      })
      const nodes = parseContentNode(stepOutput[Step.PreviewGeneration]!);
      nodeSelection.insertNodes([
        $createLineBreakNode(),
        ...nodes,
      ])
      onClose();
    });
  }, [editor, handleInsertBelowSelection, onClose, parseContentNode, selection?.rangeSelection, stepOutput]);

  const stepContent = useMemo(() => {
    if (!isOpen) return null;
    switch (step) {
      case Step.SelectMenuItem:
        return (
          <PromptSelectAIAction
            isRangeSelection={!!selection?.rangeSelection}
            cursorPosition={selection?.cursorPosition}
            actions={options}
            onSelectAction={handleSelectOption}
          />
        );
      case Step.AddFreeText:
        return (
          <PromptFreetext
            onSubmit={handleSubmitFreetext}
            cursorY={selection?.cursorPosition?.y}
          />
        );
      case Step.PreviewGeneration:
        return (
          <RenderPreview
            enableReplace={!!selection?.rangeSelection}
            onSelectReplace={handleReplaceSelection}
            onSelectCancel={handleClose}
            onSelectInsertBelow={handleInsertBelowSelection}
            content={stepOutput[Step.PreviewGeneration]!}
          />
        );
      default:
        return null;
    }
  }, [handleClose, handleInsertBelowSelection, handleReplaceSelection, handleSelectOption, handleSubmitFreetext, isOpen, options, selection?.cursorPosition, selection?.rangeSelection, step, stepOutput]);

  if (!isOpen) {
    return null;
  }

  return <div ref={containerRef}>{stepContent}</div>;
};
