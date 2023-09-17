import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col max-w-[1000px] mx-auto w-full">
      <section className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between gap-4 p-4">
          <h1>
            Spee<span className="text-blue-400">Chify</span>
          </h1>
          <button className="flex items-center gap-2">
            <p>New</p>
            <i className="fa-regular fa-square-plus"></i>
          </button>
        </header>

        <main className="flex-1 bg-blue-200 flex flex-col justify-center p-4">
          ssjsjss
        </main>
      </section>
      <h1 className="text-3xl font-bold underline text-green-400">
        Hello world!
      </h1>

      <footer></footer>
    </div>
  );
}

export default App;
