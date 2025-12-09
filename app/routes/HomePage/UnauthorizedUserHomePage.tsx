import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";

export default function UnauthorizedUserHomePage(props: { message: string }) {
  const password = `Secret-${crypto.randomUUID()!}`;
  const navigate = useNavigate();
  const [triggerGuest, setTriggerGuest] = useState<boolean>(false);

  const [guestUser, setGuestUser] = useState({
    email: `${crypto.randomUUID().replace("-", ".")}@random.com`,
    password,
    retypedPassword: password,
    firstName: `Anon`,
    lastName: "Nymous",
    birthdate: "0001-01-01",
  });
  const randomSignUpFetcher = useFetcher();
  const randomLoginFetcher = useFetcher();

  useEffect(() => {
    if (
      !randomSignUpFetcher.data &&
      randomSignUpFetcher.state === "idle" &&
      triggerGuest
    ) {
      randomSignUpFetcher
        .submit({ ...guestUser }, { action: "/signUp", method: "post" })
        .then(() => {
          console.log("Guest user Generated");
          randomLoginFetcher
            .submit(
              {
                email: guestUser.email,
                password: guestUser.password,
              },
              { method: "post", action: "/login" },
            )
            .then(() => {
              navigate("/");
            });
        });
    }
  }, [triggerGuest]);

  return (
    <section>
      <h1 className="w-full bg-amber-50/60 p-10 text-center text-7xl text-amber-300 text-shadow-lg dark:bg-amber-950/60 dark:text-shadow-white/30">
        Welcome to the homepage!
      </h1>
      <h2 className="w-full bg-white/50 p-5 text-center text-5xl leading-15 dark:bg-black/50">
        {/* A Brief Message From The Server: {props.message} */}
        The Odin Book is a website with the intention of hosing the online
        discussion of everyone's favorite novels!
      </h2>
      <div className="flex w-full justify-center p-10">
        <button
          className="rounded-full bg-amber-500 p-5 text-2xl shadow ring-5 ring-orange-500 text-shadow-lg hover:cursor-pointer hover:bg-amber-600 active:bg-amber-400"
          onClick={(event) => {
            setTriggerGuest(true);
          }}
        >
          Explore the site as a guest?
        </button>
      </div>
    </section>
  );
}
