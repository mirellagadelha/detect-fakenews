import React, { useState, useEffect, useRef } from "react";
import { TouchBallLoading } from 'react-loadingg';

import { ApiDetect } from "./services/ApiDetect";
import "./index.css";

const currentDate = () => {
  const data = new Date();
  return data.toLocaleTimeString();
}

function App() {
  const [value, setValue] = useState("");
  const [messages, setMessage] = useState("");
  const [hidden, setHidden] = useState(true);

  function detectNews(news) {
    if (news.length  > 0 && news.length < 100){
      setMessage([
        ...messages,
        {
          id: messages.length + 1,
          isBoot: false,
          text: news,
          hour: `${currentDate()}, Hoje`,
        },
        {
          id: messages.length + 1,
          isBoot: true,
          text: "O texto enviado é muito pequeno! O texto deve ter pelo menos 100 caracteres. Por favor, insira o texto completo da notícia na caixa abaixo.",
          hour: `${currentDate()}, Hoje`,
        },
      ]);
    }else{
      const formatNews = news.replace(/['"]+/g, "'");

      ApiDetect.detectNews(formatNews).then(({ data }) => {
        setMessage([
          ...messages,
          {
            id: messages.length + 1,
            isBoot: false,
            text: news,
            hour: `${currentDate()}, Hoje`,
          },
          {
            id: messages.length + 1,
            isBoot: true,
            text: data.message,
            hour: `${currentDate()}, Hoje`,
          },
        ]);
      });
    }

    setValue("");
  }

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    setHidden(true)
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="block--background">
      <div className="chatbot__overview">
        <ul className="chatlist">
          <li className="bot__output bot__output--standard">Olá, meu nome é Aletheia!</li>
          <li className="bot__output bot__output--standard">
            O sistema irá processar o texto para identificar características de escrita, como palavras usadas ou classes gramaticais mais frequentes, e utilizar essas características em um modelo de aprendizado de máquina que classificará a notícia em verdadeira ou falsa.
          </li>
          <li className="bot__output bot__output--standard">
            Copie o texto de uma notícia, cole na caixa abaixo e clique em <span className="bot__command">"Enviar"</span>.
          </li>
          {messages &&
            messages.map((message) => {
              const { isBoot, text, hour, id } = message;
              if (isBoot) {
                return (
                  <li key={id}
                    className="bot__output bot__output--failed"
                    style={{
                      animationDelay: "600ms",
                      animationPlayState: "running",
                    }}
                  >
                    {text}
                  </li>
                );
              }
              return <li key={id+1} className="userInput">{text}</li>;
            })}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="chatbox-area">
        {hidden ? '' : <TouchBallLoading/>}

        <div action="" id="chatform">
          <textarea
            placeholder="Insira o texto da sua notícia aqui."
            className="chatbox"
            name="chatbox"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></textarea>
          <input
            className="submit-button"
            type="submit"
            value="Enviar"
            onClick={()=>{ detectNews(value); setHidden(false)}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;