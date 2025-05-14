"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useChat } from "@ai-sdk/react";
import { useRef, useState } from "react";

export default function Chat() {
  const [language, setLanguage] = useState("english");
  const [topic, setTopic] = useState("restaurant");
  const [level, setLevel] = useState("beginner");
  const [started, setStarted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const { messages } = useChat({
    initialMessages: started
      ? [
          {
            id: "welcome",
            role: "assistant",
            content: `Alright, let's get started.\n\nReady to practice your ${language}? We'll jump into a ${topic} scenario tailored for the ${level} level.\n\nThe goal is simple: natural conversation practice. No pressure, just talk.\n\nWhen you're ready, click the button below to begin. Just start with a simple "hello".`,
          },
        ]
      : [],
    body: {
      language,
      level,
      topic,
    },
  });

  async function startRecording() {
    try {
      // Request user for mic permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Record audio blob and store blob chunks
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log(chunksRef.current);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  return (
    <div className="h-screen">
      {!started ? (
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="text-center">
                Choose your learning settings.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-2">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Proficiency Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="fluent">Fluent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Conversation topic</Label>
                <Select value={topic} onValueChange={setTopic}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="casual chat">Casual Chat</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="job interview">Job Interview</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full cursor-pointer"
                size="lg"
                onClick={() => setStarted(true)}
              >
                Start Learning
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="h-full flex flex-col px-11 py-8">
          <div>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" ? (
                  <div className="space-y-4">
                    {message.content.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="bg-blue-600 rounded-lg p-3 ml-auto max-w-[80%]">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-auto flex justify-center">
            <Button
              variant="outline"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
