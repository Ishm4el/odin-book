import { Form } from "react-router";
import type { Route } from "./+types/index";
export default function Component({}) {
  return (
    <section className="h-full w-full bg-white">
      <h1>User Search</h1>
      <search role="search">
        <Form method="GET">
          <label htmlFor="search-user">Search User:</label>
          <input type="text" name="search-user" id="search-user" />
          <button type="submit">Search</button>
        </Form>
      </search>
    </section>
  );
}
