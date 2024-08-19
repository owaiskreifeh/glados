import * as yup from 'yup';

type JsonValue = string | number | boolean | null | JsonArray | JsonObject;
interface JsonArray extends Array<JsonValue> {}
interface JsonObject { [key: string]: JsonValue; }


export function inferYupSchema(json: JsonValue): yup.AnySchema {
  if (Array.isArray(json)) {
    if (json.length > 0) {
      return yup.array().of(inferYupSchema(json[0])); // @todo: check all not only first one, check if mixed
    }
    return yup.array();
  } else if (typeof json === 'object' && json !== null) {
    const shape = Object.keys(json).reduce((acc, key) => {
      acc[key] = inferYupSchema(json[key]);
      return acc;
    }, {} as { [key: string]: yup.AnySchema });
    return yup.object().shape(shape);
  } else if (typeof json === 'string') {
    return yup.string();
  } else if (typeof json === 'number') {
    return yup.number();
  } else if (typeof json === 'boolean') {
    return yup.boolean();
  } else {
    return yup.mixed().nullable();
  }
}


export function schemaToString(schema: yup.AnySchema): string {
    if (schema instanceof yup.StringSchema) {
      return 'yup.string()';
    } else if (schema instanceof yup.NumberSchema) {
      return 'yup.number()';
    } else if (schema instanceof yup.BooleanSchema) {
      return 'yup.boolean()';
    } else if (schema instanceof yup.ArraySchema) {
      const innerSchema = schema.innerType as yup.AnySchema;
      return `yup.array().of(${schemaToString(innerSchema)})`;
    } else if (schema instanceof yup.ObjectSchema) {
      const shape = (schema as yup.ObjectSchema<any>).fields;
      const fieldsString = Object.keys(shape).map(key => `${key}: ${schemaToString(shape[key] as yup.AnySchema)}`).join(', ');
      return `yup.object().shape({${fieldsString}})`;
    } else if (schema instanceof yup.MixedSchema && schema.spec.nullable) {
      return 'yup.mixed().nullable(true)';
    }
    return 'yup.mixed()';
  }