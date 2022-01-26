import { useState } from "react";
import client from "../lib/api/client";
import axios from "axios";
export default function Login() {
  const [id, setId] = useState<string>("");
  const [pw, setpw] = useState<string>("");

  function loginId(e: any) {
    setId(e.target.value);
  }
  function loginpw(e: any) {
    setpw(e.target.value);
  }

  function login() {
    axios
      .post("http://localhost:8000/api/login", {
        username: id,
        password: pw,
      })
      .then((res) => {
        console.log(res.data);
      });
  }
  return (
    <div style={{ padding: "100px 0", textAlign: "center" }}>
      <div className="w-full min-h-screen bg-gray-50 flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
        <div className="w-full sm:max-w-md p-5 mx-auto">
          <h2 className="mb-12 text-center text-5xl font-extrabold">로그인.</h2>
          <div className="mb-4">
            <label className="block mb-1">Email-Address</label>
            <input
              id="email"
              type="text"
              name="email"
              className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
              value={id}
              onChange={loginId}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="py-2 px-3 border border-gray-300 focus:border-red-300 focus:outline-none focus:ring focus:ring-red-200 focus:ring-opacity-50 rounded-md shadow-sm disabled:bg-gray-100 mt-1 block w-full"
              value={pw}
              onChange={loginpw}
            />
          </div>

          <div className="mt-6">
            <button
              onClick={login}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold capitalize text-white hover:bg-red-700 active:bg-red-700 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200 disabled:opacity-25 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
