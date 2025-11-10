"use client";

import React, { useState, useEffect } from "react";
import CategoriesList from "../../../components/CategoriesList/CategoriesList";
import { Category, fetchCategories } from "../../../lib/api/clientApi"; // Наш імітований запит

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]); // усі категорії
  const [totalCategories, setTotalCategories] = useState(0); // кількість категорій
  const [isLoading, setIsLoading] = useState(false);

  const INITIAL_LIMIT = 6; // початок
  const ADDITION_LIMIT = 3; // додавання

  useEffect(() => {
    const loadInitialCategories = async () => {
      setIsLoading(true);

      const response = await fetchCategories({
        show: 0,
        limit: INITIAL_LIMIT,
      });
      console.log("response", response);

      setCategories(response.data.categories); // перші 6 категорій
      setTotalCategories(response.total); // загальна кількість

      setIsLoading(false);
    };

    loadInitialCategories();
  }, []);

  const handleLoadMore = async () => {
    setIsLoading(true);

    const currentShow = categories.length;

    const response = await fetchCategories({
      show: currentShow,
      limit: ADDITION_LIMIT,
    });

    //  не заміняю старі категорії, а додаю до них нові.
    setCategories((prevCategories) => [
      ...prevCategories,
      ...response.data.categories,
    ]);

    setIsLoading(false);
  };

  // Кнопку ховати : при загрузці та коли завантажили всі доступні категорії
  const shouldShowButton = !isLoading && categories.length < totalCategories;

  return (
    <div>
      <h1>Категорії</h1>
      <p>поки без стілізаціі - перевірка що все працює</p>

      <CategoriesList categories={categories} />

      {isLoading && <p>Завантаження...</p>}

      {shouldShowButton && (
        <button type="button" onClick={handleLoadMore}>
          Показати більше
        </button>
      )}
    </div>
  );
};

export default CategoriesPage;
