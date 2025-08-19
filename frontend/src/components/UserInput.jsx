import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import React from "react";

export default function UserInput() {
  const textareaRef = React.useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";

      const { lineHeight, paddingTop, paddingBottom } =
        getComputedStyle(textarea);
      const rowHeight = parseInt(lineHeight);
      const padding = parseInt(paddingTop) + parseInt(paddingBottom);

      const maxHeight = rowHeight * 5 + padding;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);

      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY =
        newHeight < textarea.scrollHeight ? "auto" : "hidden";
    }
  };

  return (
    <div className="flex items-end mr-8 my-4 h-min-[5rem]">
      <Textarea
        ref={textareaRef}
        onInput={handleInput}
        rows={1}
        placeholder="Type your message here..."
        className=" resize-none rounded-sm"
      />
      <Button className="ml-2" size="icon" variant="ghost">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button className="ml-2" size="icon" variant="ghost">
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
