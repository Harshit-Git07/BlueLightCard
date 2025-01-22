import { z } from 'zod';

export type NamedZodType<ZodDefinition extends z.ZodTypeAny> = ZodDefinition & {
  readonly _ModelName: string;
};

export function createZodNamedType<ZodDefinition extends z.ZodTypeAny>(
  name: string,
  zodDefinition: ZodDefinition,
): NamedZodType<ZodDefinition> {
  const zodDefinitionWithNamedType = zodDefinition as NamedZodType<ZodDefinition>;
  // @ts-expect-error. This adds model name to the zod defination to be used as part of deployment
  zodDefinitionWithNamedType._ModelName = name;
  return zodDefinitionWithNamedType;
}
