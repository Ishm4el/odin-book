export default function UnauthorizedUserHomePage(props: { message: string }) {
  return (
    <section>
      <h1 className="w-full bg-amber-50/60 p-10 text-center text-7xl text-amber-300 text-shadow-lg dark:bg-amber-950/60 dark:text-shadow-white/30">
        Welcome to the homepage!
      </h1>
      <h2 className="w-full bg-white/50 p-5 text-center text-5xl leading-15 dark:bg-black/50">
        {/* A Brief Message From The Server: {props.message} */}
        The Odin Book is a website with the intention of hosing the online discussion of everyone's favorite novels!
      </h2>
    </section>
  );
}
