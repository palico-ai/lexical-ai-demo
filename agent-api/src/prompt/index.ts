import {
  PromptParamsCommon,
  PromptBuilder,
} from "@palico-ai/app";
import EditorComponentSchemas from "./editor_component";
import zodToJsonSchema from "zod-to-json-schema";
import actionPrompts, { Action } from "./action_prompts";
import { EditorComponent, PayloadCommon, PromptParams } from "./types";
import { LLMRules } from "./rules";

export class AppPromptBuilder implements PromptBuilder {
  private getPromptForComponent(component: EditorComponent) {
    const schema = zodToJsonSchema(component.schema);
    let prompt = `Component: ${component.name}\n`;
    if (component.description) {
      prompt += `Description: ${component.description}\n`;
    }
    prompt += `Schema: \n${JSON.stringify(schema, null, 2)}\n`;
    if (component.examples) {
      prompt += `Examples: \n${JSON.stringify(component.examples, null, 2)}\n`;
    }
    return prompt;
  }

  async getSystemPrompt(_: PromptParamsCommon): Promise<string> {
    const componentSchemas = EditorComponentSchemas.map(
      this.getPromptForComponent
    ).join("\n-------------\n");
    const rules = LLMRules.join("\n-------------\n");
    return `You're a helpful writing assistant. 
    ========================
    You MUST respond with a JSON Array with the following structure:
    ${componentSchemas}
    ========================
    You MUST also following the following rules:
    ${rules}
    `;
  }

  async getPromptForQuery(
    query: string,
    _params: PromptParamsCommon
  ): Promise<string> {
    const params = _params as unknown as PromptParams;

    const context = params.context ;
    const { action } = context;

    const handler = actionPrompts[action];
    if (!handler) {
      throw new Error(`No handler for action: ${action}`);
    }

    return handler(query, params);
  }
}

const builder = new AppPromptBuilder();
