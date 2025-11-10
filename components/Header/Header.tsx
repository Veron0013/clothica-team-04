"use client";

import { useState, useEffect } from "react";
import css from "./Header.module.css";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  return (
    <div className={css.container}>
      <header className={css.header}>
        <a href="" className={css.logo}>
          <svg width="84" height="36" aria-label="Clothica logo">
            <use href="/sprite.svg#icon-company-logo" />
          </svg>
        </a>
        <ul className={css.nav}>
          <li>
            <Link href="" aria-label="Home page">Головна</Link>
          </li>
          <li>
            <Link href="">Товари</Link>
          </li>
          <li>
            <Link href="">Категорії</Link>
          </li>
        </ul>
        <div className={css.auth}>
          <Link href="" className={css.navUp}>
            Вхід
          </Link>
          <Link href="" className={css.navIn}>
            Реєстрація
          </Link>
          {/* <Link href="" className={css.navUpBasket}>
            Кабінет
          </Link> */}
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

      {menuOpen && (
          <BurgerMenu menuOpen={menuOpen}/>
      )}
    </div>
  );
}
