import {Box, Text, TextField, Image, Button} from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import {createClient} from "@supabase/supabase-js";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNTIxOCwiZXhwIjoxOTU4ODkxMjE4fQ.6S7Q3KQSnMjYVOUTb8EO6R6o-JF2zpmuYOQYFmDaCIs";
const SUPABASE_URL = "https://eextaluwznyskcydpabb.supabase.co";

//% Create a single supabase client for interacting with your database
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
  // Sua lógica vai aqui

  const [mensagem, setMensagem] = React.useState(""); //% armazenando a mensagem digitada
  const [listChat, setListChat] = React.useState([]); //% colocar essa mensagem em uma lista

  React.useEffect(() => {
    //% Pegando dados do SUPABASE
    supabaseClient
      .from("mensagens") //% Pegar da tabela 'mensagens' la no SUPABASE
      .select("*") //% Selecionar todas as tabelas
      .order("id", {ascending: false}) //% Invertendo a ordem de busca, para mensagens virem na ordem certa
      .then(({data}) => {
        setListChat(data); //% Atribuindo valores do banco de dados na lista de mensagens
      });
  }, []);

  function handleNovaMensagem(novaMensagem) {
    //% função que recebe a mensagem digitada, adiciona essa mensagem a lista e limpa o cmpo de mensagem
    const mensagem = {
      //% criando um objeto da mensagem
      // id: listChat.length + 1, ''' Não vai precisar mais, pois o id já é cadastrado automaticamente no SUPABASE quando adiciona uma nova mensagem '''
      de: "bpcosta2003",
      texto: novaMensagem,
    };

    if (novaMensagem.length < 1) {
      alert("Mensagem muito curta");
    } else {
      supabaseClient //% Inserindo novaMensagem ao banco do SUPABASE
        .from("mensagens")
        .insert([mensagem])
        .then(({data}) => {
          setListChat([data[0], ...listChat]); //% Os '...' servem para espalhar os itens da lista sem criar array dentro de array
        });

      setMensagem("");
    }
  }

  function removeMessage(id) {
    //% Remover mensagem pelo id
    let newListMessages = listChat.filter((mensagem) => {
      //% 'Filter' para retirar a mensagem da array
      if (mensagem.id !== id) {
        return mensagem;
      }
    });
    setListChat(newListMessages);
  }

  // ./Sua lógica vai aqui
  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[100],
          backgroundImage: `url(https://images.unsplash.com/photo-1642923051153-07d4c98fe203?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          color: appConfig.theme.colors.neutrals["000"],
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            borderRadius: "5px",
            backgroundColor: "rgba(1,1,1,0.1)",
            height: "100%",
            maxWidth: "95%",
            maxHeight: "95vh",
            padding: "32px",
          }}
        >
          <Header />
          <Box
            className="boxBlur2"
            styleSheet={{
              position: "relative",
              display: "flex",
              flex: 1,
              height: "80%",
              backgroundColor: "rgba(1,1,1,0.5)",
              flexDirection: "column",
              borderRadius: "5px",
              padding: "16px",
            }}
          >
            <MessageList mensagens={listChat} removeMessage={removeMessage} />
            {/* //% Passando a lista de mensagens E removerMensagem como propriedade */}
            <Box
              as="form"
              styleSheet={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                value={mensagem}
                onChange={(event) => {
                  //% Onde está o valor ?
                  const value = event.target.value;
                  //% Trocar o valor da variável
                  setMensagem(value);
                }}
                onKeyPress={(event) => {
                  //% Quando clicar no 'Enter' vai previnir o 'pular linha' e vai chamar a função de NovaMensagem
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  neutral: {
                    textColor: appConfig.theme.colors.neutrals[900],
                    mainColor: appConfig.theme.colors.neutrals[900],
                    mainColorHighlight: appConfig.theme.colors.neutrals[300],
                    backgroundColor: appConfig.theme.colors.neutrals[100],
                  },
                  width: "100%",
                  border: "0",
                  alignItems: "center",
                  resize: "none",
                  borderRadius: "5px",
                  padding: "6px 8px",
                  marginRight: "10px",
                  marginTop: "10px",
                }}
              />
              <Button
                onClick={() => {
                  handleNovaMensagem(mensagem);
                }}
                className="btnSend"
                label="Enviar"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          margin: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading3">Chat</Text>
        <Button className="btnLogout" label="SAIR" href="/" />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        //% Fazendo a listagem da lista de mensagens
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "20px",
              marginBottom: "12px",
              hover: {
                background:
                  "linear-gradient(90deg,rgba(245,245,245,0.1),rgba(245,245,245,0.1))",
              },
            }}
          >
            <Box
              styleSheet={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row !important",
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                onClick={() => {
                  props.removeMessage(mensagem.id); //% Remover mensagem com o id selecionado
                }}
                colorVariant="neutral"
                label={<span class="material-icons">X</span>}
                styleSheet={{
                  background: "#406e8e",
                  borderRadius: "100%",
                  right: "-10px",

                  hover: {
                    backgroundColor: "#BB4430",
                  },
                }}
              />
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
