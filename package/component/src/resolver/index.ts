/**
 * Layui-vue Resolver
 *
 * √ On-demand import components for @layui/layui-vue
 * √ component and style resolver for @layui/icons-vue
 * √ layer API
 */
const matchComponents = [
  // done
  {
    pattern: /^LayButton$/,
    styleDir: "button",
  },
  {
    pattern: /^LayButtonContainer$/,
    styleDir: "container",
  },
  {
    pattern: /^LayButtonGroup$/,
    styleDir: "buttonGroup",
  },
  {
    pattern: /^LayContainer$/,
    styleDir: "container",
  },
  {
    pattern: /^LayCard$/,
    styleDir: "card",
  },
  {
    pattern: /^LayPanel$/,
    styleDir: "panel",
  },
  {
    pattern: /^LayFooter$/,
    styleDir: "footer",
  },
  {
    pattern: /^LayBody$/,
    styleDir: "body",
  },
  {
    pattern: /^LayEmpty$/,
    styleDir: "empty",
  },
  {
    pattern: /^LayBadge$/,
    styleDir: "badge",
  },
  {
    pattern: /^(LayHeader)$/,
    styleDir: "header",
  },
  {
    pattern: /^LayLogo$/,
    styleDir: "logo",
  },
  {
    pattern: /^LayLayout$/,
    styleDir: "layout",
  },
  {
    pattern: /^LayAvatar$/,
    styleDir: "avatar",
  },
  {
    pattern: /^LayAvatarList$/,
    styleDir: "avatar",
  },
  {
    pattern: /^LayRow$/,
    styleDir: "row",
  },
  {
    pattern: /^LayCol$/,
    styleDir: "row",
  },
  {
    pattern: /^LayBreadcrumb$/,
    styleDir: "breadcrumb",
  },
  {
    pattern: /^LayBreadcrumbItem$/,
    styleDir: "breadcrumb",
  },
  {
    pattern: /^LayScroll$/,
    styleDir: "scroll",
  },
  {
    pattern: /^LayResult$/,
    styleDir: "result",
  },
  {
    pattern: /^LayNoticeBar$/,
    styleDir: "noticeBar",
  },
  {
    pattern: /^LayLine$/,
    styleDir: "line",
  },
  // ....
  {
    pattern: /^(LayCarousel|LayCarouselItem)$/,
    styleDir: "",
  },
  {
    pattern: /^(LayCheckbox|LayCheckboxGroup)$/,
    styleDir: "",
  },
  {
    pattern: /^(LayCollapse|LayCollapseItem)$/,
    styleDir: "",
  },
  // 无 css
  {
    pattern: /^LayCountUp$/,
    styleDir: "",
  },
  {
    pattern: /^(LayDropdown|LayDropdownItem)$/,
    styleDir: "",
  },
  // 可能有未拆分的
  {
    pattern: /^(LayForm|LayFormItem)$/,
    styleDir: "formItem",
  },
  {
    pattern: /^(LayMenuItem|LaySubMenu)$/,
    styleDir: "menu",
  },
  {
    pattern: /^LayPage$/,
    styleDir: "",
  },
  {
    pattern: /^LayProgress$/,
    styleDir: "",
  },
  {
    pattern: /^LayRadio$/,
    styleDir: "",
  },
  {
    pattern: /^LaySelectOption$/,
    styleDir: "select",
  },
  {
    pattern: /^LaySkeletonItem$/,
    styleDir: "skeleton",
  },
  {
    pattern: /^LaySplitPanelItem$/,
    styleDir: "splitPanel",
  },
  {
    pattern: /^LayStepItem$/,
    styleDir: "step",
  },
  {
    pattern: /^LaySwitch$/,
    styleDir: "",
  },
  {
    pattern: /^(LayTab|LayTabItem)$/,
    styleDir: "",
  },
  {
    pattern: /^LayTimelineItem$/,
    styleDir: "timeline",
  },
  {
    pattern: /^LayTolltip$/,
    styleDir: "popper",
  },
];

export interface LayuiVueResolverOptions {
  /**
   * import style along with components
   *
   * @default 'css'
   */
  importStyle?: boolean | "css";

  /**
   * resolve `@layui/layui-vue' icons
   * requires package `@layui/icons-vue`
   *
   * @default false
   */
  resolveIcons?: boolean;

  /**
   * exclude components that do not require automatic import
   * @default []
   *
   */
  exclude?: string[];
}

const libRE = /^Lay[A-Z]/;
const layerRE = /^(layer|LayLayer)$/;
const iconsRE = /^([A-Z][\w]+Icon|LayIcon)$/;
const esComponentsFolder = "@layui/layui-vue/es";

function lowerCamelCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function getSideEffects(importName: string, options: LayuiVueResolverOptions) {
  const { importStyle = true } = options;
  if (!importStyle) return;
  let styleDir: string | undefined = undefined;
  if (importName.match(iconsRE)) {
    return `@layui/icons-vue/lib/index.css`;
  } else if (importName.match(layerRE)) {
    return `@layui/layer-vue/lib/index.css`;
  } else if (importName.match(libRE)) {
    styleDir = lowerCamelCase(importName.slice(3)); // LayBackTop -> backTop
    for (const item of matchComponents) {
      if (item.pattern.test(importName)) {
        styleDir = item.styleDir;
        break;
      }
    }
    return styleDir ? `${esComponentsFolder}/${styleDir}/index.css` : undefined;
  }
}

function resolveComponent(name: string, options: LayuiVueResolverOptions) {
  let importName: string | undefined = undefined;
  let path: string = `@layui/layui-vue`;
  let sideEffects: string | string[] | undefined;

  if (options.resolveIcons && name.match(iconsRE)) {
    importName = name;
    path = `@layui/icons-vue`;
    sideEffects = getSideEffects(name, options);
  } else if (name.match(layerRE)) {
    importName = name;
    path = `@layui/layer-vue`;
    sideEffects = getSideEffects(name, options);
  } else if (name.match(libRE) && !options?.exclude?.includes(name)) {
    importName = name;
    path = `@layui/layui-vue`;
    sideEffects = getSideEffects(name, options);
  }

  return importName ? { importName, path, sideEffects } : null;
}

/**
 * Resolver for layui-vue
 *
 * @param options
 * @returns
 */
export function LayuiVueResolver(options: LayuiVueResolverOptions = {}) {
  return {
    type: "component",
    resolve: (name: string) => {
      return resolveComponent(name, options);
    },
  };
}
