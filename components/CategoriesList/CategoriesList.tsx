import React from "react";
import Image from "next/image";
import { CategoriesListResponse } from "@/lib/api/clientApi";

const CategoriesList = ({ categories }: CategoriesListResponse) => {
  return (
    <ul style={{ display: "flex", flexWrap: "wrap", gap: "12" }}>
      {categories.map((category) => (
        <li key={category._id.$oid}>
          <Image
            src={category.img_url}
            alt={category.name}
            width={300}
            height={300}
          />
          <h3>{category.name}</h3>
        </li>
      ))}
    </ul>
  );
};
export default CategoriesList;
