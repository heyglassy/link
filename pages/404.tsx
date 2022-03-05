import Link from "next/link";

const PageNotFound = () => {
  return (
    <div className="flex flex-row justify-center items-center h-screen">
      <h1 className="mr-2 font-bold">404: </h1>
      <Link href="/">
        <a className="border rounded bg-gradient-to-r from-cyan-500 to-blue-500 p-1 font-bold text-white">
          Return to home
        </a>
      </Link>
    </div>
  );
};

export default PageNotFound;
