import * as chrono from "chrono-node";
import type { NextPage } from "next";
import { useState } from "react";
import superjson from "superjson";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import Down from "react-countdown";
import type { Form } from "../types/form";
import { futureDate } from "../utils/utils";
import classNames from "classnames";

const createLink = (formData: Form) => {
  const cipher = CryptoJS.AES.encrypt(
    superjson.stringify({ link: formData.link, date: new Date().toString() }),
    process.env.NEXT_PUBLIC_SECRET!
  ).toString();
  return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(cipher));
};

const Home: NextPage = () => {
  const [form, setForm] = useState<Form>({ date: "", link: "", valid: false });
  const router = useRouter();

  const dateInput = classNames("border", {
    "border-red-500": !form.valid && form.date.length > 0,
    "text-red-500": !form.valid && form.date.length > 0,
  });

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.valid && router.push(`/countdown/${createLink(form)}`);
        }}
        className="flex flex-col justify-center h-screen"
      >
        {form.valid && (
          <Down date={new Date(form!.date).getTime()} autoStart={false} />
        )}
        <span className="font-medium text-slate-700">Date</span>
        <input
          type="text"
          onChange={(e) => {
            const time = chrono.parseDate(e.target.value);
            chrono.parseDate(e.target.value) &&
              setForm({
                ...form,
                date: time.toString(),
                valid: futureDate(time.getTime()),
              });
          }}
          minLength={1}
          placeholder="Tomorrow at noon"
          className={dateInput}
        />
        {!form.valid && form.date.length > 0 && (
          <h1 className="text-sm text-red-500">Date must be in the future</h1>
        )}
        <span className="font-medium text-slate-700">Link</span>
        <input
          type="url"
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://hyper.co"
          required
          className="border"
        />
        <input
          type="submit"
          value="Submit"
          className="text-right self-end border"
        />
      </form>
    </div>
  );
};

export default Home;
