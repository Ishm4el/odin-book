export default function UnauthorizedUserHomePage(props: { message: string }) {
  return (
    <section>
      <h1 className="w-full bg-amber-50/60 p-10 text-center text-7xl text-amber-300 text-shadow-lg">
        Welcome to the homepage!
      </h1>
      <h2 className="w-full bg-white/50 p-5 text-center text-5xl">
        A Brief Message From The Server: {props.message}
      </h2>
    </section>
  );
}
