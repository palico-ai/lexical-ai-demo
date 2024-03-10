import { ActionPromptFN } from "./types";

export enum Action {
  AskAIToWrite = "ASK_AI_TO_WRITE",
  CreateVideoSummary = "CREATE_VIDEO_SUMMARY",
  CreatePricingSuggestions = "CREATE_PRICING_SUGGESTIONS",
  SummarizeText = "SUMMARIZE_TEXT",
  TranslateText = "TRANSLATE_TEXT",
}

// =============================================================================

const notImplemented = () => {
  throw new Error("Method not implemented.");
}

const askAIToWritePrompt: ActionPromptFN = (query, params) => {
  const { selectedText, freeText } = params.context.payload;
  const userPrompt = query ?? freeText;
  if(!userPrompt || userPrompt.length === 0) {
    throw new Error("Prompt not specified");
  }
  if (selectedText) {
    return `
    Context:
    ${selectedText}
    ------
    Question:
    ${userPrompt}
    `;
  }
  return `You are asked to write about: ${query}`;
}

const summarizeTextPrompt: ActionPromptFN = (_, params) => {
  const { selectedText } = params.context.payload;
  if(!selectedText) {
    throw new Error("Text to summarize not specified");
  }
  return `DO NOT USE ANY HEADINGS. Rephrase and summarize the following text:
  ${selectedText}`;
}

const translateTextPrompt: ActionPromptFN = (_, params) => {
  const { selectedText, selectedOptionValue } = params.context.payload;
  if (!selectedOptionValue) {
    throw new Error("Language not specified");
  }
  if (!selectedText) {
    throw new Error("Text to translate not specified");
  }
  return `Translate the following text to ${selectedOptionValue}:
  ${selectedText}
  `;
}

// =============================================================================

const actionPrompts: Record<Action, ActionPromptFN> = {
  [Action.AskAIToWrite]: askAIToWritePrompt,
  [Action.SummarizeText]: summarizeTextPrompt,
  [Action.TranslateText]: translateTextPrompt,
  [Action.CreateVideoSummary]: notImplemented,
  [Action.CreatePricingSuggestions]: notImplemented,
};

export default actionPrompts;