import React, { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import superjson from "superjson";
import CryptoJS from "crypto-js";
import Down from "react-countdown";
import type { Form } from "../../types/form";
import { futureDate } from "../../utils/utils";

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
  }, [router, form]);

  if (!countdown || !form) return null;

  return (
    <div>
      <Down date={new Date(form!.date).getTime()} />
    </div>
  );
};

export default Countdown;
