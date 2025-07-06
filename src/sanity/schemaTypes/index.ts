import { type SchemaTypeDefinition } from "sanity";
import { articleType } from "./articleType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [articleType],
};
