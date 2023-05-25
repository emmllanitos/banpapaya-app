const API_URL = "http://127.0.0.1:8000/api/openCV/";

export const resultOpenCV = async (email) => {
  return await fetch(API_URL + email);
  //return await fetch(`${API_URL}${email}`);
};
