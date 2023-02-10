import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./Chatinput";
import Logout from "./Logout";
// import { v4 as uuidv4 } from "uuid";
import axios from "../utils/axios";
import { getMessageRoute, sendMessageRoute } from "../utils/endpoints";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messageSent, setMessageSent] = useState(false);
  const [messages, setMessages] = useState([]);
  const [arrivalMsg, setArrivalMsg] = useState(null);
  const scrollRef = useRef();

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      reciver: currentChat?.id,
      sender: currentUser?.id,
      text: msg,
      users: [currentChat?.id, currentUser?.id],
    });
    socket.current.emit("send-msg", {
      to: currentChat?.id,
      from: currentUser?.id,
      message: msg,
    });
    const msgs = [...messages];

    msgs.push({
      fromSelf: true,
      message: msg,
    });
    setMessages(msgs);
    setMessageSent(true);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMsg({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMsg && setMessages((prev) => [...prev, arrivalMsg]);
  }, [arrivalMsg]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getmessages = async () => {
    const response = await axios.post(getMessageRoute, {
      from: currentUser?.id,
      to: currentChat?.id,
    });
    console.log(response.data);
    setMessages(response.data);
  };

  useEffect(() => {
    if (currentChat) {
      getmessages();
    }
  }, [messageSent]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{currentChat?.name}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((item) => {
              return (
                <div ref={scrollRef} key={item.id}>
                  <div
                    className={`${
                      item.fromSelf === true
                        ? "message sended"
                        : "message recieved"
                    }`}
                  >
                    <div className="content ">
                      <p>{item.message} </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  aside.EmojiPickerReact.epr-main {
    top: -400px !important;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
