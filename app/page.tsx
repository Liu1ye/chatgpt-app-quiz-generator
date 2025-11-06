"use client";

import i18next from "i18next";
import TaylorFormulaTest from "./components/TaylorFormulaTest";
import { useTranslation } from "react-i18next";

const languages = [
  { value: "en-US", label: "English" },
  { value: "zh-CN", label: "中文" },
  { value: "zh-TW", label: "繁体中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
  { value: "ru", label: "Русский" },
  { value: "fil", label: "Filipino" },
  { value: "pt", label: "Português" },
]

export default function Home() {
  const { i18n } = useTranslation();
  return (
   <>
    <TaylorFormulaTest />
    {/* <div className="flex justify-center items-center px-4 py-2 bg-gray-100 rounded-md mt-4">  
      修改语言： <select onChange={(e) => i18n.changeLanguage(e.target.value)}>
        {
          languages.map((language) => (
            <option key={language.value} value={language.value}>{language.label}</option>
          ))
        }
      </select>
   </div> */}
    </>
  );
}