import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function SignIn() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post('http://26.166.44.17:5000/api/users/login', {
            userName: userName,
            password: password
        });
        // Store token and navigate
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/dashboard/home');
    } catch (error) {
        if (error.response) {
            console.error(`HTTP error! status: ${error.response.status}`);
            toast.error('Usuario o contraseña incorrectos!');
        } else {
            console.error('Login failed:', error.message);
            toast.error('An error occurred. Please try again.');
        }
    }
};



  return (
    <section className="m-8 flex gap-4">
      <Toaster />
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Inicia Sesión</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Usuario
            </Typography>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              name="userName"
              size="lg"
              type="text"
              placeholder="Nombre de usuario"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Contraseña
            </Typography>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Button className="mt-6" fullWidth onClick={handleLogin}>
            Entrar
          </Button>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/1366_2000.jpeg"
          className="h-[92vh] w-max object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
