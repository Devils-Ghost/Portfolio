"use client";

import { Send, Mail } from "lucide-react";
import Modal from "@/components/ui/Modal";

type Props = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Here you can handle the form submission, e.g., send data to an API or email service
  alert(
    "Form submitted! (This is a placeholder action for future API integration.)",
  );
};

export default function HireMeModal({ isOpen, setIsOpen }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      className="max-w-lg bg-black p-6"
    >
      <h3 className="text-xl font-bold text-white tracking-tight mb-4 pr-8">
        Let's Connect
      </h3>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          placeholder="Company"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          placeholder="Role"
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <input
          type="text"
          placeholder="Contact Information (Email/Phone)"
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm"
        />
        <textarea
          placeholder="Personalized Message"
          rows={4}
          required
          className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 text-white text-sm resize-none"
        ></textarea>

        <button
          type="submit"
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-2"
        >
          <Send size={16} /> Send Message
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-xs text-gray-500 font-medium tracking-widest">
          OR
        </span>
        <div className="flex-1 h-px bg-white/10"></div>
      </div>

      <a
        href="mailto:dtanna2@asu.edu"
        className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <Mail size={16} /> Send customized email instead
      </a>
    </Modal>
  );
}
