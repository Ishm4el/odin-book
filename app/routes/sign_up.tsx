import { Form, Link, data, redirect } from "react-router";
import type { Route } from "./+types/sign_up";
import FormSmallCard from "~/components/FormSmallCard";
import { useReducer } from "react";
import bcrypt from "bcryptjs";
import validator from "validator";
import invariant from "tiny-invariant";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Signing Up" },
    { name: "description", content: "Signing Up!" },
  ];
}

const PASSWORD_MINIMUM_LENGTH = /^.{6,}$/;
const PASSWORD_SINGLE_LOWERCASE = /^(?=.*[a-z]).*$/;
const PASSWORD_SINGLE_UPPERCASE = /^(?=.*[A-Z]).*$/;
const PASSWORD_SINGLE_NUMBER = /\d/;
const PASSWORD_SINGLE_SPECIAL = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submittedEmail = String(formData.get("email"));
  const submittedPassword = String(formData.get("password"));
  const submittedRetypedPassword = String(formData.get("retypedPassword"));

  if (!validator.isEmail(submittedEmail))
    throw new Error("Invalid submitted email");

  invariant(
    PASSWORD_MINIMUM_LENGTH.test(submittedPassword),
    "Password must be at least 6 characters long"
  );
  invariant(
    PASSWORD_SINGLE_LOWERCASE.test(submittedPassword),
    "Password must have a lowercase character"
  );
  invariant(
    PASSWORD_SINGLE_UPPERCASE.test(submittedPassword),
    "Password must have an uppercase character"
  );
  invariant(
    PASSWORD_SINGLE_NUMBER.test(submittedPassword),
    "Password must contain a single number"
  );
  invariant(
    PASSWORD_SINGLE_SPECIAL.test(submittedPassword),
    "Password must contain a special character"
  );

  if (submittedPassword !== submittedRetypedPassword)
    throw new Error(
      "Submitted password and submitted retyped-password do not match"
    );

  const hashedPassword = await bcrypt.hash(submittedPassword, 10);
}

const colorValidateText = (bool: boolean) => {
  if (bool) return "text-green-500";
  else return "text-pink-600";
};

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
      return {
        ...state,
        validLength: PASSWORD_MINIMUM_LENGTH.test(action.payload),
      };
    case "validateLowercase":
      return {
        ...state,
        validLowercase: PASSWORD_SINGLE_LOWERCASE.test(action.payload),
      };
    case "validateUppercase":
      return {
        ...state,
        validUppercase: PASSWORD_SINGLE_UPPERCASE.test(action.payload),
      };
    case "validateNumber":
      return {
        ...state,
        validNumber: PASSWORD_SINGLE_NUMBER.test(action.payload),
      };
    case "validateSpecial":
      return {
        ...state,
        validSpecial: PASSWORD_SINGLE_SPECIAL.test(action.payload),
      };
    default:
      throw new Error("passwordRequirementsReducer: invalid action.type used");
  }
}

export default function Component({ actionData }: Route.ComponentProps) {
  const [validPasswordState, validPasswordDispatch] = useReducer(
    passwordRequirementsReducer,
    passwordRequirementsReducerInitialState
  );
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
            className="shadow appearance-none border border-gray-200 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            className="shadow appearance-none border border-red-500/50 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => {
              const currentPasswordInput = e.currentTarget.value;
              validPasswordDispatch({
                type: "validateLength",
                payload: currentPasswordInput,
              });
              validPasswordDispatch({
                type: "validateLowercase",
                payload: currentPasswordInput,
              });
              validPasswordDispatch({
                type: "validateUppercase",
                payload: currentPasswordInput,
              });
              validPasswordDispatch({
                type: "validateNumber",
                payload: currentPasswordInput,
              });
              validPasswordDispatch({
                type: "validateSpecial",
                payload: currentPasswordInput,
              });
            }}
          />
        </div>
        <section className="mb-4">
          <h3>Password requirements</h3>
          <ul id="password-requirements">
            <li className={colorValidateText(validPasswordState.validLength)}>
              6 characters minimum
            </li>
            <li
              className={colorValidateText(validPasswordState.validLowercase)}
            >
              1 lowercase
            </li>
            <li
              className={colorValidateText(validPasswordState.validUppercase)}
            >
              1 uppercase
            </li>
            <li className={colorValidateText(validPasswordState.validNumber)}>
              1 number
            </li>
            <li className={colorValidateText(validPasswordState.validSpecial)}>
              1 special character
            </li>
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
            className="shadow appearance-none border border-red-500/50 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
