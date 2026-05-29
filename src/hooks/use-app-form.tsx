// TanStack Form Hook Factory.
// Initializes shared form and field contexts for `@tanstack/react-form`.
// Provides strongly typed hooks (`useAppForm`, `useTypedAppFormContext`) 
// used across complex UI forms (e.g., TTS generation, custom voice creation).
"use client";

import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, useTypedAppFormContext } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});
