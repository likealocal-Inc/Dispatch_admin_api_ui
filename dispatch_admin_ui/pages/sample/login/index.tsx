import { NextPage } from "next";
import useCallAPI from "../../../libs/client/hooks/useCallAPI";
import { APIURLs } from "@libs/client/constants";
import { useForm } from "react-hook-form";

interface LoginForm {
  name?: string;
  passworld?: string;
}

interface MutationResult {
  ok: boolean;
  res: Object;
}
const Login: NextPage = () => {
  const [send, { loading, data, error }] = useCallAPI<MutationResult>(
    APIURLs.LOGIN
  );

  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const onLoginValid = (validForm: LoginForm) => {
    if (loading) return;
    send(validForm);
  };
  console.log(data && data!.res);
  return (
    <>
      <div className=''>{}</div>
      <form onSubmit={handleSubmit(onLoginValid)}>
        <input
          type='text'
          id='name'
          {...register("name", { required: true })}
        />
        <button>{loading ? "Loading.." : "전송"}</button>
      </form>
    </>
  );
};

export default Login;
