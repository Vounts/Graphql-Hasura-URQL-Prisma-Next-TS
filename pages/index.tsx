import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from "@/styles/Home.module.css";
import { SubscriptionHandler, useQuery } from "urql";
import { UsersQuery } from "graphql-client/queries/users";
import React, { useState, useEffect, Key } from "react";
import axios from "axios";
import { newUsers } from "graphql-client/subscriptions/new_user";
import { useSubscription } from "urql";

const handleSubscription: SubscriptionHandler<any, any> = (
  users = [],
  response
) => {
  return Object.assign(response.users, ...users);
};

const Home: NextPage = () => {
  /*
  const [result, reexecuteQuery] = useQuery({
    query: UsersQuery,
  });
  */

  const [res] = useSubscription({ query: newUsers }, handleSubscription);

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [DisabledButton, setDisabledButton] = useState(false);
  const { data, fetching, error } = res;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      <ul>
        <div>New Users: </div>
        {data &&
          data.map((user: any, idx: Key) => (
            <div key={idx}>
              <li>{user.email}</li>
              <li>{user.id}</li>
            </div>
          ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDisabledButton(true);
          axios
            .post("/api/register", {
              email: Username,
              pass: Password,
            })
            .then((res) => {
              if (res) {
                setDisabledButton(false);
              }
            });
        }}
      >
        <input
          type="text"
          value={Username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={`Email`}
        />
        <input
          type="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`Password`}
        />
        <button type="submit" disabled={DisabledButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Home
