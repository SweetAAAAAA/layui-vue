import type { VNode, Slots } from "vue";
import type { ColProps } from "@layui/layui-vue/types/component/col/index.vue";
import type { FormItemProps } from "@layui/layui-vue/types/component/formItem/index.vue";
import type { FormProps } from "@layui/layui-vue/types/component/form/index.vue";

import type { ValidateError } from "async-validator";

export type Type =
  | "input"
  | "select"
  | "textarea"
  | "switch"
  | "radio"
  | "date"
  | "rate"
  | "checkbox";

export type modelType = {
  [key: string]: any;
};

export type customRenderFnType = (
  SchemaValueType: SchemaValueType,
  model: modelType
) => VNode;
export type customRenderType = string | customRenderFnType;

export interface JsonSchemaFormProps extends FormProps {
  space?: number | string;
  schema: SchemaProps;
}

export interface SchemaProps {
  [key: string]: SchemaValueType;
}

export interface SchemaValueType extends FormItemProps {
  type?: Type;
  hidden?: boolean;
  props: modelType;
  slots: SlotsType;
  listeners?: listenersType;
  colProps?: ColProps;
}

export type SlotsType = {
  customRender?: customRenderType;
} & customSlotType;

export type customSlotType = {
  [key: string]: customRenderType;
};

export type listenersType = {
  [key: string]: () => void;
};

export interface FormCallback {
  (isValid?: boolean, model?: modelType, errors?: ValidateError[] | null): void;
}