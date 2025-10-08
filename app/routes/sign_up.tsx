import { Form, Link, data, redirect } from "react-router";
import type { Route } from "./+types/sign_up";
import FormSmallCard from "~/components/FormSmallCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signing Up" },
    { name: "description", content: "Signing Up!" },
  ];
}

const passwordRequirementsReducerInitialState = {
  validLength: false,
  validLowercase: false,
  validUppercase: false,
  validNumber: false,
  validSpecial: false,
};

type ACTIONTYPE =
  | { type: "validateLength"; payload: string }
  | { type: "validateLowercase"; payload: string }
  | { type: "validateUppercase"; payload: string }
  | { type: "validateNumber"; payload: string }
  | { type: "validateSpecial"; payload: string };

function passwordRequirementsReducer(
  state: typeof passwordRequirementsReducerInitialState,
  action: ACTIONTYPE
) {
  switch (action.type) {
    case "validateLength":
      return { ...state, validLength: /^.{6,}$/.test(action.payload) };
    case "validateLowercase":
      return {
        ...state,
        validLowercase: /^(?=.*[a-z]).*$/.test(action.payload),
      };
    case "validateUppercase":
      return {
        ...state,
        validUppercase: /^(?=.*[A-Z]).*$/.test(action.payload),
      };
    case "validateNumber":
      return {
        ...state,
        validNumber: /\d/.test(action.payload),
      };
    case "validateSpecial":
      return {
        ...state,
        validSpecial: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(
          action.payload
        ),
      };
    default:
      throw new Error("passwordRequirementsReducer: invalid action.type used");
  }
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
            required
            type="email"
            name="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="password"
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <section className="mb-4">
          <h3>Password requirements</h3>
          <ul id="password-requirements">
            <li>6 characters minimum</li>
            <li>1 lowercase</li>
            <li>1 uppercase</li>
            <li>1 number</li>
            <li>1 special character</li>
          </ul>
        </section>
        <div className="mb-6">
          <label
            htmlFor="retypedPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Retype Password
          </label>
          <input
            required
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
