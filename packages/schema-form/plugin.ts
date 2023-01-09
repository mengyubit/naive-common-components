import { Plugin } from "vite";
// 详情： fix: https://github.com/vitejs/vite/discussions/

// 将下面这一句换成后面两句
// import  require$$0$l, { defineComponent, useCssVars, unref, computed as computed$1, resolveComponent, openBlock, createBlock, normalizeStyle, withCtx, createElementVNode, normalizeClass, renderSlot, createCommentVNode, createVNode, createElementBlock, Fragment, renderList, toDisplayString, createStaticVNode, useAttrs, toRefs, mergeProps, createTextVNode, ref as ref$1, watch, reactive, readonly, provide, inject, resolveDirective, withDirectives, h, onBeforeUnmount, watchEffect, toRaw, getCurrentInstance, onMounted, onBeforeMount, Comment, toRef, Teleport, nextTick, onActivated, onDeactivated, onUnmounted, getCurrentScope, onScopeDispose, vShow, isVNode, markRaw, withKeys, normalizeProps, guardReactiveProps, createSlots }  from "vue";

// import * as require$$0$l from "vue"
// import  { defineComponent, useCssVars, unref, computed as computed$1, resolveComponent, openBlock, createBlock, normalizeStyle, withCtx, createElementVNode, normalizeClass, renderSlot, createCommentVNode, createVNode, createElementBlock, Fragment, renderList, toDisplayString, createStaticVNode, useAttrs, toRefs, mergeProps, createTextVNode, ref as ref$1, watch, reactive, readonly, provide, inject, resolveDirective, withDirectives, h, onBeforeUnmount, watchEffect, toRaw, getCurrentInstance, onMounted, onBeforeMount, Comment, toRef, Teleport, nextTick, onActivated, onDeactivated, onUnmounted, getCurrentScope, onScopeDispose, vShow, isVNode, markRaw, withKeys, normalizeProps, guardReactiveProps, createSlots }  from "vue";

const regex = /import (.*?),(.*?)from "vue"/g;
function replaceVue3DefautImport(code='') {
  return code.replace(regex, 'import * as $1 from "vue"\nimport $2 from "vue"');
}

export  function fixVue3NoMatchingExportDefaultPlugin(opt: {
  fileName?: string;
}): Plugin {
  return {
    name: "vite:fixVue3NoMatchingExportDefaultPlugin",
    enforce: "post",
    apply: "build",
    generateBundle(options, bundle, isWrite) {
      Object.entries(bundle).forEach(([fileName, value]: any) => {
        if (opt.fileName) {
          if (fileName === opt.fileName) {
            value.code = replaceVue3DefautImport(value.code);
          }
        } else {
          value.code = replaceVue3DefautImport(value.code);
        }
      });
    },
  };
}