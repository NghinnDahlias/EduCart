type VariantValues = Record<string, Record<string, string>>;
type DefaultVariants<T extends VariantValues> = Partial<{
  [K in keyof T]: keyof T[K];
}>;

type VariantSelection<T extends VariantValues> = Partial<{
  [K in keyof T]: keyof T[K] | null | undefined;
}> & {
  class?: string;
  className?: string;
};

type CVAConfig<T extends VariantValues> = {
  variants?: T;
  defaultVariants?: DefaultVariants<T>;
};

export type VariantProps<T> = T extends (props?: infer P) => any ? Omit<P, "class" | "className"> : never;

export function cva<T extends VariantValues>(base: string, config?: CVAConfig<T>) {
  return (props?: VariantSelection<T>) => {
    const variants = config?.variants ?? ({} as T);
    const defaults = (config?.defaultVariants ?? {}) as DefaultVariants<T>;
    const classes = [base];

    for (const variantName of Object.keys(variants) as Array<keyof T>) {
      const optionMap = variants[variantName];
      const selectedKey = (props?.[variantName] ?? defaults[variantName]) as keyof typeof optionMap | undefined;
      if (selectedKey && optionMap[selectedKey as string]) {
        classes.push(optionMap[selectedKey as string]);
      }
    }

    if (props?.class) classes.push(props.class);
    if (props?.className) classes.push(props.className);

    return classes.filter(Boolean).join(" ");
  };
}
