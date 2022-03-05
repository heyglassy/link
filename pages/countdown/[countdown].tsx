import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import CryptoJS from "crypto-js";
import Down from "react-countdown";

interface Form {
  date: string;
  link: string;
  valid: boolean;
}

const futureDate = (date: number) => {
  return date > Date.now();
};

const decrypt = (query: string) => {
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

  const form = countdown ? decrypt(countdown) : null;

  useEffect(() => {
    if (!countdown) return;
    if (!form) router.push("/404");
    if (!futureDate(new Date(form!.date).getTime())) router.push(form!.link);
  }, [router, form]);

  return (
    <div>
      <h1>{countdown && decrypt(countdown)!.date}</h1>
      <Down date={Date.now() + 10000} />
    </div>
  );
};

export default Countdown;