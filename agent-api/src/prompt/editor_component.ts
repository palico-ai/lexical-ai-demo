import * as zod from 'zod'
import { EditorComponent } from './types'

// Define the schemas for different nodes that the agent should be able to generate
const EditorComponentSchemas : EditorComponent[] = [
  {
    name: "heading",
    description: `Used to represent a heading in the document.`,
    schema: zod.object({
      type: zod.enum(["heading1", "heading2", "heading3"]),
      value: zod.string(),
    }),
    examples: [
      { type: "heading1", value: "This is a top level header" },
      { type: "heading2", value: "This is a sub header"},
      { type: "heading3", value: "This is a sub sub header" },
    ]
  },
  {
    name: "paragraph",
    schema: zod.object({
      type: zod.literal("paragraph"),
      value: zod.string(),
    }),
    examples: [
      { type: "paragraph", value: "This is a paragraph" }
    ]
  }
]

export default EditorComponentSchemas