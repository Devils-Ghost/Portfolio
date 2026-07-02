import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        This is the home page. You can navigate to the following pages:
        <ul className="list-disc pl-5">
          <li>
            <a href="/about" className="text-blue-500 hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="/experience" className="text-blue-500 hover:underline">
              Experience
            </a>
          </li>
          <li>
            <a href="/projects" className="text-blue-500 hover:underline">
              Projects
            </a>
          </li>
          <li>
            <a href="/blog" className="text-blue-500 hover:underline">
              Blog
            </a>
          </li>
        </ul>
      </main>
    </div>
  );
}
