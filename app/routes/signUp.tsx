import { Form, Link, data, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/signUp";
import FormSmallCard from "~/components/FormSmallCard";
import { useEffect, useReducer } from "react";
import bcrypt from "bcryptjs";
import validator from "validator";
import invariant from "tiny-invariant";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { ToastContainer, toast } from "react-toastify";
import { readFile } from "fs";
import { LocalFileStorage } from "@remix-run/file-storage/local";
import { getStorageKey } from "~/services/avatar-storage.server";

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

const validateSubmittedForm = async ({
  submittedFirstName,
  submittedBirthdate,
  submittedEmail,
  submittedLastName,
  submittedPassword,
  submittedRetypedPassword,
}: {
  submittedFirstName: string;
  submittedLastName: string;
  submittedBirthdate: string;
  submittedEmail: string;
  submittedPassword: string;
  submittedRetypedPassword: string;
}) => {
  if (!validator.isDate(submittedBirthdate)) throw new Error("Invalid Date");

  if (!validator.isEmail(submittedEmail))
    throw new Error("Invalid submitted email");

  invariant(
    PASSWORD_MINIMUM_LENGTH.test(submittedPassword),
    "Password must be at least 6 characters long",
  );
  invariant(
    PASSWORD_SINGLE_LOWERCASE.test(submittedPassword),
    "Password must have a lowercase character",
  );
  invariant(
    PASSWORD_SINGLE_UPPERCASE.test(submittedPassword),
    "Password must have an uppercase character",
  );
  invariant(
    PASSWORD_SINGLE_NUMBER.test(submittedPassword),
    "Password must contain a single number",
  );
  invariant(
    PASSWORD_SINGLE_SPECIAL.test(submittedPassword),
    "Password must contain a special character",
  );

  if (submittedPassword !== submittedRetypedPassword)
    throw new Error(
      "Submitted password and submitted retyped-password do not match",
    );

  const hashedPassword = await bcrypt.hash(submittedPassword, 10);

  return {
    firstName: submittedFirstName,
    lastName: submittedLastName,
    birthdate: submittedBirthdate,
    hashedPassword,
    email: submittedEmail,
  };
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submittedEmail = String(formData.get("email"));
  const submittedPassword = String(formData.get("password"));
  const submittedRetypedPassword = String(formData.get("retypedPassword"));
  const submittedFirstName = String(formData.get("firstName"));
  const submittedLastName = String(formData.get("lastName"));
  const submittedBirthdate = String(formData.get("birthdate"));

  const validatedInputs = await validateSubmittedForm({
    submittedBirthdate,
    submittedEmail,
    submittedFirstName,
    submittedLastName,
    submittedPassword,
    submittedRetypedPassword,
  });

  const db = database();

  try {
    const toReturn = await db
      .insert(schema.users)
      .values({
        birthdate: validatedInputs.birthdate,
        email: validatedInputs.email,
        firstName: validatedInputs.firstName,
        lastName: validatedInputs.lastName,
        password: validatedInputs.hashedPassword,
      })
      .returning();

    readFile("./server/profileImages/theDefault.jpg", (err, data) => {
      if (err) throw err;
      console.log("data has been uploaded");
      console.log(typeof data);

      const file = new File([data], "dumb.jpg");

      const storage = new LocalFileStorage("./server/profileImages");
      const storageKey = getStorageKey(toReturn[0].id);
      storage.set(storageKey, file);
    });

    return toReturn;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
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
  action: ACTIONTYPE,
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

function BasicInputField({
  name,
  text,
  type = "text",
  additionalClassName = "",
}: {
  name: string;
  text: string;
  type?: string;
  additionalClassName?: string;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200"
      >
        {text}
      </label>
      <input
        required
        type={type}
        name={name}
        id={name}
        className={`focus:shadow-outline mb-3 w-full appearance-none rounded border border-gray-200 px-3 py-2 leading-tight text-gray-700 shadow invalid:border-red-500/50 invalid:text-red-600 focus:outline-none ${additionalClassName} dark:bg-gray-600 dark:text-gray-200 dark:invalid:border-red-500 dark:invalid:text-red-500`}
      />
    </div>
  );
}

function PasswordRequirements({
  validPasswordState,
}: {
  validPasswordState: {
    validLength: boolean;
    validLowercase: boolean;
    validUppercase: boolean;
    validNumber: boolean;
    validSpecial: boolean;
  };
}) {
  return (
    <section className="mb-4">
      <h3>Password requirements</h3>
      <ul id="password-requirements">
        <li className={colorValidateText(validPasswordState.validLength)}>
          6 characters minimum
        </li>
        <li className={colorValidateText(validPasswordState.validLowercase)}>
          1 lowercase
        </li>
        <li className={colorValidateText(validPasswordState.validUppercase)}>
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
  );
}

export default function Component({ actionData }: Route.ComponentProps) {
  const [validPasswordState, validPasswordDispatch] = useReducer(
    passwordRequirementsReducer,
    passwordRequirementsReducerInitialState,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData) {
      toast.success(
        "Welcome " + actionData[0].lastName + "!\nRedirecting to Login Page",
        {
          toastId: "OutSuccess",
          ariaLabel: "Successfully Signed Up!",
          onClose: () => {
            navigate("/login");
          },
        },
      );
    }
  }, [actionData]);

  return (
    <FormSmallCard title="Sign Up">
      <Form
        method="post"
        className="mb-4 bg-white px-8 pt-6 pb-8 dark:bg-gray-700"
      >
        <BasicInputField name="firstName" text="First Name" />
        <BasicInputField name="lastName" text="Last Name" />
        <BasicInputField name="birthdate" text="Birthdate" type="date" />
        <BasicInputField name="email" text="Email" type="email" />
        <PasswordRequirements validPasswordState={validPasswordState} />
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200"
          >
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="password"
            className="focus:shadow-outline mb-3 w-full appearance-none rounded border border-red-500/50 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none dark:border-red-500 dark:bg-gray-600 dark:text-gray-200"
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

        <BasicInputField
          name="retypedPassword"
          text="Retype Password"
          type="password"
          additionalClassName="mb-6"
        />
        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-700 focus:outline-none"
        >
          Sign Up
        </button>
      </Form>
      <ToastContainer />
    </FormSmallCard>
  );
}
