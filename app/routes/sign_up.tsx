import { Form, Link, data, redirect } from "react-router";
import type { Route } from "./+types/sign_up";
import FormSmallCard from "~/components/FormSmallCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signing Up" },
    { name: "description", content: "Signing Up!" },
  ];
}

export default function Component({ actionData }: Route.ComponentProps) {
  return (
    <FormSmallCard title="Sign Up">
      <Form method="post" className="bg-white px-8 pt-6 pb-8 mb-4 ">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="retypedPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Retype Password
          </label>
          <input
            type="password"
            name="retypedPassword"
            id="retypedPassword"
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
        >
          Sign Up
        </button>
      </Form>
    </FormSmallCard>
  );
}
