import { Form } from "react-router";
import type { Route } from "./+types/index";
export default function Component({}) {
  return (
    <section className="h-[50%] w-[50%] bg-amber-50">
      <search role="search">
        <Form method="GET" className="flex flex-col items-center gap-3 p-5">
          <label
            htmlFor="search-user"
            className="text-shadow text-center text-3xl text-amber-500"
          >
            Search User:
          </label>
          <input
            placeholder="Enter a username"
            type="text"
            name="search-user"
            id="search-user"
            className="border bg-slate-100 p-1 hover:bg-slate-50 focus:bg-white active:bg-sky-50"
          />
          <button
            type="submit"
            className="rounded-full border bg-white p-2 px-5 text-slate-900 transition-colors hover:cursor-pointer hover:bg-sky-50 hover:text-black active:bg-sky-100"
          >
            Search
          </button>
        </Form>
      </search>
    </section>
  );
}
