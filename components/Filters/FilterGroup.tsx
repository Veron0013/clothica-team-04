// components/Filters/FilterGroup.tsx
"use client";

import FilterItem from "./FilterItem";
import css from "./FilterGroup.module.css";

export default function FilterGroup({
  title,
  name,
  options,
  onClose,
}: {
  title: string;
  name: string;
  options: { value: string; label: string }[];
  onClose?: () => void;
}) {
  if (!options?.length) return null;

  return (
    <section className={css.filterGroup} aria-label={title}>
      <h4 className={css.filterTitle}>{title}</h4>
      <ul className={css.filterList}>
        {options.map((opt) => (
          <FilterItem
            key={opt.value}
            name={name}
            value={opt.value}
            label={opt.label}
            onClose={onClose}
          />
        ))}
      </ul>
    </section>
  );
}
