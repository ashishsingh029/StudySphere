import { CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useState } from 'react'
import { Button } from '@/components/ui/button';

const ChatFooter = () => {
    const [input, setInput] = useState("");
    const inputLength = input.trim().length;
  return (
      <CardFooter className="py-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputLength === 0) return;
            // setMessages([...messages, { role: "user", sender: "You", content: input, time: "Now" }]);
            setInput("");
          }}
          className="flex w-full items-center space-x-2">
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1 bg-slate-200"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button>+</Button>
          <Button type="submit" size="icon" 
          className="bg-blue-600"
          disabled={inputLength === 0}>
            <Send className="size-5" />
          </Button>
        </form>
      </CardFooter>
  )
}

export default ChatFooter