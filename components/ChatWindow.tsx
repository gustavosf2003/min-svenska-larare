"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useChat } from "ai/react";
import { useRef, useState, useEffect, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";

import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { IntermediateStep } from "./IntermediateStep";
import Link from "next/link";
import { Button } from "./Button";

export function ChatWindow(props: {
  endpoint: string;
  emptyStateComponent: ReactElement;
  placeholder?: string;
  titleText?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}) {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    endpoint,
    emptyStateComponent,
    placeholder,
    titleText = "An LLM",
    showIngestForm,
    showIntermediateStepsToggle,
    emoji,
  } = props;

  const [showIntermediateSteps, setShowIntermediateSteps] = useState(false);
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);

  const intemediateStepsToggle = showIntermediateStepsToggle && (
    <div>
      <input
        type="checkbox"
        id="show_intermediate_steps"
        name="show_intermediate_steps"
        checked={showIntermediateSteps}
        onChange={(e) => setShowIntermediateSteps(e.target.checked)}
      ></input>
      <label htmlFor="show_intermediate_steps"> Show intermediate steps</label>
    </div>
  );

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading: chatEndpointIsLoading,
    setMessages,
  } = useChat({
    api: endpoint,
    onError: (e) => {
      toast(e.message, {
        theme: "dark",
      });
    },
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (messageContainerRef.current) {
      messageContainerRef.current.classList.add("grow");
    }
    if (!messages.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    if (chatEndpointIsLoading ?? intermediateStepsLoading) {
      return;
    }
    if (!showIntermediateSteps) {
      handleSubmit(e);
      // Some extra work to show intermediate steps properly
    } else {
      setIntermediateStepsLoading(true);
      setInput("");
      const messagesWithUserReply = messages.concat({
        id: messages.length.toString(),
        content: input,
        role: "user",
      });
      setMessages(messagesWithUserReply);
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: messagesWithUserReply,
          show_intermediate_steps: true,
        }),
      });
      const json = await response.json();
      setIntermediateStepsLoading(false);
      if (response.status === 200) {
        // Represent intermediate steps as system messages for display purposes
        const intermediateStepMessages = (json.intermediate_steps ?? []).map(
          (intermediateStep: AgentStep, i: number) => {
            return {
              id: (messagesWithUserReply.length + i).toString(),
              content: JSON.stringify(intermediateStep),
              role: "system",
            };
          },
        );
        const newMessages = messagesWithUserReply;
        for (const message of intermediateStepMessages) {
          newMessages.push(message);
          setMessages([...newMessages]);
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 + Math.random() * 1000),
          );
        }
        setMessages([
          ...newMessages,
          {
            id: (
              newMessages.length + intermediateStepMessages.length
            ).toString(),
            content: json.output,
            role: "assistant",
          },
        ]);
      } else {
        if (json.error) {
          toast(json.error, {
            theme: "dark",
          });
          throw new Error(json.error);
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center -mb-8 rounded grow h-full">
      <h2 className={`${messages.length > 0 ? "" : "hidden"} text-2xl`}>
        🇸🇪 {titleText} 🇸🇪
      </h2>
      <div>{messages.length === 0 ? emptyStateComponent : ""}</div>
      <div
        className="flex flex-col-reverse w-full h-full  overflow-auto transition-[flex-grow] ease-in-out mt-2"
        ref={messageContainerRef}
      >
        {messages.length > 0
          ? [...messages]
              .reverse()
              .map((m) =>
                m.role === "system" ? (
                  <IntermediateStep key={m.id} message={m}></IntermediateStep>
                ) : (
                  <ChatMessageBubble
                    key={m.id}
                    message={m}
                    aiEmoji={emoji}
                  ></ChatMessageBubble>
                ),
              )
          : ""}
      </div>

      <form
        ref={formRef}
        onSubmit={sendMessage}
        className="flex flex-col w-full"
      >
        <div className="flex">{intemediateStepsToggle}</div>
        <div className="flex w-full gap-4 mt-4 ">
          <textarea
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey == false) {
                e.preventDefault();
                console.log("submitting");
                formRef.current?.requestSubmit();
              }
            }}
            className="w-full h-16 px-3 text-white py-2 pt-5 border !border-gray-700 focus:outline-none focus:!border-gray-600 rounded bg-gray-800 resize-none grow "
            value={input}
            placeholder={placeholder ?? "What's it like to be a pirate?"}
            onChange={handleInputChange}
          />
          <Button type="submit" className=" lg:px-8 shrink-0">
            <div
              role="status"
              className={`${
                chatEndpointIsLoading || intermediateStepsLoading
                  ? ""
                  : "hidden"
              } flex justify-center`}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <span
              className={
                chatEndpointIsLoading || intermediateStepsLoading
                  ? "hidden"
                  : ""
              }
            >
              Skicka
            </span>
          </Button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
