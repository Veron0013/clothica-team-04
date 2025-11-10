import Link from "next/link";
import css from "./BurgerMenu.module.css"

interface BurgerMenuProps {
  menuOpen: boolean;
}

export default function BurgerMenu({menuOpen}: BurgerMenuProps ){
    return ( <div
      className={`${css.burgerMenu} ${menuOpen ? css.active : ""}`}
    >
    <ul className={css.burgerNav}>
          <li>
            <Link href="">Головна</Link>
          </li>
          <li>
            <Link href="">Товари</Link>
          </li>
          <li>
            <Link href="">Категорії</Link>
          </li>
        </ul>
        <div className={css.BurgerAuth}>
          <Link href="" className={css.BurgerNavUp}>
            Вхід
          </Link>
          <Link href="" className={css.BurgerNavIn}>
            Реєстрація
                </Link> 
                {/* <a href="" className={css.BurgerNavUpBasket}>
            Кабінет
          </a> */
          }    
           </div> </div> )
}