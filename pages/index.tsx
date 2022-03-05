import * as chrono from "chrono-node";
import type { NextPage } from "next";
import { useState } from "react";
import superjson from "superjson";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";
import Down from "react-countdown";

/**
 * Date picker
 * Enter a date (ex. tomorrow at noon)
 * While entering, the result (renderer of date) will be null until the parser returns a date
 *
 * Form
 * Validate date is in future,
 * Validate that the link is a link.
 * Link should have a preview pane (similar to hyper link preview) (extra)
 * Date should display in a cool number font or something.
 */

interface Form {
  date: string;
  link: string;
  valid: boolean;
}

const futureDate = (date: number) => {
  return date > Date.now();
};

const createLink = (formData: Form) => {
  const cipher = CryptoJS.AES.encrypt(
    superjson.stringify({ link: formData.link, date: formData.date }),
    process.env.NEXT_PUBLIC_SECRET!
  ).toString();
  return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(cipher));
};

const Home: NextPage = () => {
  const [form, setForm] = useState<Form>({ date: "", link: "", valid: false });
  const router = useRouter();

  return (
    <div>
      {form.valid && (
        <Down date={new Date(form!.date).getTime()} autoStart={false} />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.valid && router.push(`/countdown/${createLink(form)}`);
        }}
      >
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
        />
        {!form.valid && form.date.length > 0 && (
          <h1>Date must be in the future</h1>
        )}
        <input
          type="url"
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="https://hyper.co"
          required
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default Home;
