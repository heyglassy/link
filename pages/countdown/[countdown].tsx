import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import CryptoJS from "crypto-js";
import Down from "react-countdown";
import type { Form } from "../../types/form";
import { futureDate } from "../../utils/utils";
import copy from "copy-to-clipboard";

const decryptLink = (query: string) => {
  const cipher = CryptoJS.enc.Hex.parse(query).toString(CryptoJS.enc.Utf8);
  const form = CryptoJS.AES.decrypt(
    cipher,
    process.env.NEXT_PUBLIC_SECRET!
  ).toString(CryptoJS.enc.Utf8);
  if (form.length === 0) return null;
  return superjson.parse<Form>(form);
};

const Countdown: NextPage = () => {
  const router = useRouter();
  const { countdown }: any = router.query;

  const form = countdown ? decryptLink(countdown) : null;

  useEffect(() => {
    if (!countdown) return;
    if (!form) router.push("/404");
    if (!futureDate(new Date(form!.date).getTime())) router.push(form!.link);
  }, [router, form, countdown]);

  if (!countdown || !form) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Down
        date={new Date(form!.date).getTime()}
        className="font-bold"
        onComplete={() => router.push(form.link)}
      />
      {typeof window !== "undefined" && (
        <input
          type="button"
          value="copy this link"
          onClick={() => copy(window.location.href)}
          className="border rounded bg-gradient-to-r from-cyan-500 to-blue-500 p-1 font-bold text-white cursor-pointer"
        />
      )}
    </div>
  );
};

export default Countdown;
