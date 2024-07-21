import { signIn } from "next-auth/react";

const LoginButton = () => {
  return (
    <button onClick={() => signIn("github").then(v => {
      console.log(v);
    })}>
      Sign in with GitHub
    </button>
  );
};

export default LoginButton;