import * as React from "react";
import Button from "@material-ui/core/Button";
import emojiFlags from "emoji-flags";
import { makeStyles } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import i18next from "i18next";

export const ChangeLanguage = () => {
    const useStyles = makeStyles({
        paragraph: { textAlign: "center" },
    });
    const classes = useStyles();
    const [cookies, setCookie, removeCookie] = useCookies(['']);
    const navigate = useNavigate();

    const switchLang = (lang) => {
        setCookie("lang", lang);
        i18next.changeLanguage(lang);
        navigate(0);
    };

    const usLangHandler = () => {
        switchLang("en");
    };
    const bgLangHandler = () => {
        switchLang("bg");
    };

    const bgFlag = emojiFlags.countryCode("BG").emoji;
    const usFlag = emojiFlags.countryCode("GB").emoji;

    const nowLanguage = localStorage.getItem("lang");

    return (
        <div className={classes.paragraph}>
            <Button onClick={usLangHandler} style={{ fontSize: "20px" }}>
                {usFlag}
            </Button>

            <Button onClick={bgLangHandler} style={{ fontSize: "20px" }}>
                {bgFlag}
            </Button>
        </div>
    );
};
