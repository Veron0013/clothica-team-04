"use client";

import { useState } from "react";
import Link from "next/link";
import css from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={css.container}>
      <header className={css.header}>
        <Link href="/" className={css.logo}>
          <svg width="84" height="36" aria-label="Clothica logo">
            <use href="/sprite.svg#icon-company-logo" />
          </svg>
        </Link>
        <nav className={css.nav}>
          <Link href="/">Головна</Link>
          <Link href="/products">Товари</Link>
          <Link href="/categories">Категорії</Link>
        </nav>

        <div className={css.auth}>
          <Link href="/login" className={css.navUp}>
            Вхід
          </Link>
          <Link href="/register" className={css.navUp}>
            Реєстрація
          </Link>
           <Link href="/basket" className={css.navUpBasket}>
            Кошик
          </Link>
        <div className={css.navCont}>
          <button
            className={css.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Відкрити меню"
          >
            <svg width="24" height="24">
              <use href={`/sprite.svg#${menuOpen ? "close" : "menu"}`} />
            </svg>
          </button>
          <div className={css.basket}>
            <svg width="24" height="24">
              <use href="/sprite.svg#shopping_cart" />
            </svg>
          </div>
          </div>
          </div>
      </header>
    </div>
  );
}
