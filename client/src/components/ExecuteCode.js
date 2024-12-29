import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants/constant";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async ({ language, sourceCode }) => {
  console.log(language, sourceCode);
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};
