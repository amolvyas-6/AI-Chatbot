import Welcome from "@/components/Welcome.jsx";
export default function ChatDefault({ messages }) {
  if (!messages) {
    return (
      <div className="flex-grow mr-4 mt-4 flex items-center justify-center">
        <Welcome />
      </div>
    );
  } else {
    return <div className="flex-grow mr-4 mt-4 flex"></div>;
  }
}
