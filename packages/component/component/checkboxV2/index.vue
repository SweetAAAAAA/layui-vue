<script setup lang="ts">
import { LayIcon } from "@layui/icons-vue";
import { computed, inject, useSlots } from "vue";
import "@layui/component/component/checkbox/index.less";
import { CheckboxSize } from "./interface";
import useProps from "./index.hooks";

export interface CheckboxProps {
  name?: string;
  skin?: string;
  label?: string;
  value: string | number | object;
  modelValue?: boolean | Array<string | number | object>;
  isIndeterminate?: boolean;
  size?: CheckboxSize;
  disabled?: boolean;
}

defineOptions({
  name: "LayCheckboxV2",
});

const props = withDefaults(defineProps<CheckboxProps>(), {
  isIndeterminate: false,
  modelValue: false,
  disabled: false,
  label: "",
});

const { size } = useProps(props);

const checkboxGroup: any = inject("checkboxGroup", {});

const isGroup = computed(() => {
  return (
    checkboxGroup != undefined && checkboxGroup?.name === "LayCheckboxGroup"
  );
});

const emit = defineEmits(["update:modelValue", "change"]);

const slots = useSlots();

const isChecked = computed({
  get() {
    if (isGroup.value) {
      return checkboxGroup.modelValue.value.includes(props.value);
    } else {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(props.value);
      } else {
        return props.modelValue;
      }
    }
  },
  set(val) {
    if (isGroup.value) {
      setGroupModelValue(val);
    } else {
      if (Array.isArray(props.modelValue)) {
        setArrayModelValue(val);
      } else {
        emit("update:modelValue", val);
        emit("change", val);
      }
    }
  },
});

const arrayModelValue = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return [...props.modelValue];
  } else {
    return [];
  }
});

const setGroupModelValue = function (checked: any) {
  let groupModelValue = [...checkboxGroup.modelValue.value];
  if (!checked) {
    groupModelValue.splice(groupModelValue.indexOf(props.value), 1);
  } else {
    groupModelValue.push(props.value);
  }
  checkboxGroup.modelValue.value = groupModelValue;
};

const setArrayModelValue = function (checked: any) {
  let arr = [...arrayModelValue.value];
  if (!checked) {
    arr.splice(arr.indexOf(props.value), 1);
  } else {
    arr.push(props.value);
  }
  emit("update:modelValue", arr);
  emit("change", arr);
};

const handleClick = function () {
  if (!isDisabled.value) {
    isChecked.value = !isChecked.value;
  }
};
const isDisabled = computed(() => {
  if (props.disabled) {
    return true;
  }
  if (
    checkboxGroup.hasOwnProperty("disabled") &&
    checkboxGroup.disabled.value
  ) {
    return true;
  }
  return false;
});

defineExpose({ toggle: handleClick });
</script>

<template>
  <span @click.stop="handleClick" class="layui-checkbox" :size="size">
    <input type="checkbox" :name="name" :value="value" />
    <div
      class="layui-form-checkbox"
      :class="{
        'layui-form-checked': isChecked,
        'layui-checkbox-indeterminate': !isChecked && props.isIndeterminate,
        'layui-checkbox-disabled layui-disabled': isDisabled,
      }"
      :lay-skin="skin"
    >
      <span class="layui-checkbox-label">
        <template v-if="slots.default || label">
          <slot>{{ label }}</slot>
        </template>
      </span>
      <lay-icon
        :type="
          isChecked
            ? 'layui-icon-ok'
            : props.isIndeterminate
            ? 'layui-icon-subtraction'
            : ''
        "
      ></lay-icon>
    </div>
  </span>
</template>
