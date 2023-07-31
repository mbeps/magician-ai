import { Tool, tools } from "@/constants/constants";

/**
 * Gets a tool object by its label.
 * @param label (string): the label of the tool
 * @returns (Tool | null): the tool object if found, null otherwise
 */
export function getToolByLabel(label: string): Tool | null {
  return tools.find((tool) => tool.label === label) || null;
}
