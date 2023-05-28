export const resultOpenCV = async (formData) => {
  const result = await fetch("http://127.0.0.1:8000/api/filelogin/", {
    method: "POST",
    body: formData,
  });

  const data = await result.json();

  return data;
};
