"use client";
import { useState } from "react";

export default function Home() {
  const [fileState, setfileState] = useState<File | null>(null);
  const [predictionResult, setpredictionResult] = useState<string | null>(null);
  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileState) {
      return;
    }
    const formData = new FormData();
    formData.append("file", fileState);
    try {
      const data = await fetch("http://127.0.0.1:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!data.ok) {
        throw new Error(`Upload failed with status: ${data.status}`);
      }
      const data2 = await data.json();
      setpredictionResult(data2.result);
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  }
  return (
    <>
      <section className="flex flex-col h-screen w-screen justify-center items-center">
        <form className="flex flex-row " onSubmit={submitForm}>
          <input
            type="file"
            name="file"
            accept=".jpeg, .png, .jpg"
            className="bg-blue-50 border-4 border-gray-50"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files == null) {
                return;
              } else {
                setfileState(e.target.files[0]);
              }
            }}
          ></input>
          <button type="submit" className="w-15">
            Submit
          </button>
        </form>
        <p id="result">
          {predictionResult ? "That is a " + predictionResult : ""}
        </p>
      </section>
    </>
  );
}
