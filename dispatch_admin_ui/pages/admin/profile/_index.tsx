import AdminLayout from "@components/layouts/AdminLayout";
import { callAPI } from "@libs/client/call/call";
import { APIURLs } from "@libs/client/constants";
import useCallAPI, { UseAPICallResult } from "@libs/client/hooks/useCallAPI";
import { UserModel } from "@libs/client/models/user_model";
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type UserFormType = {
  email: string;
  phone: string;
  company: string;
  password: string;
};

export default function Profile() {
  const [update, { loading, data, error }] = useCallAPI<UseAPICallResult>({
    url: APIURLs.USER_UPDATE,
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState<UserModel>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormType>();

  const onSubmit: SubmitHandler<UserFormType> = (data) => {
    console.log(data);
    // handle your form submission logic here
  };

  useEffect(() => {
    callAPI({ urlInfo: APIURLs.ME }).then((d) => {
      const user = d.json().then((d) => {
        setUser(d.data);
      });
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (data?.ok === false) {
        setMessage(data?.data.description.codeMessage);
      } else if (data?.ok === true) {
        location.reload();
      }
    }
  }, [loading]);

  const profileUpdate = () => {
    return;
  };
  return (
    <>
      <AdminLayout menuTitle='프로필 수정'>
        {user === undefined ? (
          "Loading..."
        ) : (
          <Container component='main' maxWidth='xs'>
            <Typography variant='h5' component='h1'>
              <div className='text-center'>사용자 정보 수정</div>
            </Typography>
            {loading && <div>Loading...</div>}
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 3 }}
            >
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email'
                type='Email'
                value={user ? user!.email : ""}
                {...register("email", { required: "Email is required" })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='password'
                label='password'
                type='Password'
                {...register("password")}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                id='phone'
                label='phone'
                value={user ? user!.phone : ""}
                {...register("phone", { required: "Phone is required" })}
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
              />
              <TextField
                margin='normal'
                fullWidth
                id='company'
                label='company'
                value={user ? user!.company : ""}
                {...register("company", { required: "Phone is required" })}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Save Changes
              </Button>
            </Box>
          </Container>
        )}
      </AdminLayout>
      )
    </>
  );
}
