import { useState, useEffect, useCallback } from "react";
import type { InputParams as TweakpaneInputParams } from "tweakpane/dist/types/api/types";
import shallow from "zustand/shallow";

import { useStore, getInitialValues } from "./store";

type InputConstructor = (TweakpaneInputParams & { value: any }) | any;

export interface Schema {
  [name: string]: InputConstructor;
}

export function useTweaks(
  nameOrSchema: string | Schema,
  schema?: Schema | Settings | undefined,
  settings?: Schema | undefined
) {
  const _schema = typeof nameOrSchema === "string" ? schema : nameOrSchema;
  const [id] = useState(() => JSON.stringify(schema));

  useEffect(() => {
    useStore.getState().init(id, nameOrSchema, schema, settings);

    return () => {
      useStore.getState().dispose();
    };
    // eslint-disable-next-line
  }, []);

  // Only update when values concering this particular instance are changed
  const valuesFromState = useStore(
    useCallback((state) => state[id], [id]),
    shallow
  );

  return valuesFromState || getInitialValues(_schema);
}

export function useTweaksInDev(
  nameOrSchema: string | Schema,
  schema?: Schema | Settings | undefined,
  settings?: Schema | undefined
) {
  const _schema = typeof nameOrSchema === "string" ? schema : nameOrSchema;

  if (process.env.NODE_ENV !== "development") {
    return getInitialValues(_schema);
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useTweaks(nameOrSchema, schema, settings);
}
