// ThemeModal.tsx

import type React from "react";
import { useDispatch, useSelector } from "react-redux"
import { uiActions } from "../store/ui-slice";

const ThemeModal = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: any) => state?.ui?.theme);

    const closeThemeModal = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("theme")) {
            dispatch(uiActions.closeThemeModal());
        }
    }

    const changeBackgroundColor = (color: string) => {
        dispatch(uiActions.changeTheme({ ...theme, backgroundColor: color }));
        localStorage.setItem("theme", JSON.stringify({ ...theme, backgroundColor: color }));
    }

    const changePrimaryColor = (color: string) => {
        dispatch(uiActions.changeTheme({ ...theme, primaryColor: color }));
        localStorage.setItem("theme", JSON.stringify({ ...theme, primaryColor: color}));
    }

  return (
    <section className="theme" onClick={e => closeThemeModal(e)}>
        <div className="theme__container">
            <article className="theme__primary">
                <h3>Primary Colors</h3>
                <ul>
                    <li onClick={() => changePrimaryColor('red')}></li>
                    <li onClick={() => changePrimaryColor('blue')}></li>
                    <li onClick={() => changePrimaryColor('yellow')}></li>
                    <li onClick={() => changePrimaryColor('green')}></li>
                    <li onClick={() => changePrimaryColor('purple')}></li>
                </ul>
            </article>
            <article className="theme__background">
                <h3>Background Colors</h3>
                <ul>
                    <li onClick={() => changeBackgroundColor('')}></li>
                    <li onClick={() => changeBackgroundColor('dark')}></li>
                </ul>
            </article>
        </div>
    </section>
  )
}

export default ThemeModal