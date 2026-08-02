"use client";
import { useEffect, useState } from "react";


export default function Home() {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  const generateVoice = () => {

    if (!text) {
      alert("Please enter some text");
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    const voice = voices.find(
      (item) => item.name === selectedVoice
    );

    if (voice) {
      speech.voice = voice;
    }

    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  const pauseVoice = () => {
    window.speechSynthesis.pause();
  };

  const resumeVoice = () => {
    window.speechSynthesis.resume();
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
  };




  const testAPI = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });

    const data = await response.json();

    console.log(data);
  };


  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);


  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-5">
      <div className="w-full max-w-2xl">

        <h1 className="text-4xl md:text-6xl font-bold text-center">
          AI Voice Generator
        </h1>

        <p className="text-gray-400 text-center mt-4">
          Convert your text into natural voice
        </p>

        <div className="mt-10 bg-zinc-900 p-6 rounded-2xl">

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your text here..."
            className="w-full h-40 bg-black border border-zinc-700 rounded-xl p-4 outline-none resize-none"
          />

          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="mt-5 w-full bg-black border border-zinc-700 rounded-xl p-3"
          >
            <option value="">
              Default Voice
            </option>

            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>

          <button
            onClick={generateVoice}
            className="mt-5 w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200"
          >
            Generate Voice
          </button>


          <div className="flex gap-3 mt-5">

            <button
              onClick={pauseVoice}
              className="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-semibold"
            >
              Pause
            </button>

            <button
              onClick={resumeVoice}
              className="flex-1 bg-green-500 text-black py-2 rounded-xl font-semibold"
            >
              Resume
            </button>

            <button
              onClick={stopVoice}
              className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold"
            >
              Stop
            </button>

          </div>
          <button
            onClick={testAPI}
            className="mt-4 w-full bg-blue-500 py-3 rounded-xl"
          >
            Test API
          </button>

        </div>

      </div>
    </main>
  );
}