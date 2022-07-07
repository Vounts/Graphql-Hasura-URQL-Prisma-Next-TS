import type { NextApiRequest, NextApiResponse } from "next";
import cuid from "cuid";
import crypto from "crypto";
import { responsePathAsArray } from "graphql";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let { email, pass } = req.body;
  if (email && pass) {
    const id = cuid();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(pass, salt, 1000, 64, "sha512")
      .toString("hex");
    const password = hash;

    var query = `mutation createUser($salt: String, $password: String, $id: String, $email: String) {
  insert_users(objects: {id: $id, password: $password, email: $email, salt: $salt}) {
    returning {
      id
    }
  }
}
`;

    const response = await fetch("http://localhost:8080/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { salt, password, id, email },
      }),
    });
    if (response.status === 200) {
      res.status(200).json({ message: "Successfully registered" });
    }
    //const js = await response.json();
    //console.log(js.data.insert_users.returning[0].id);
  } else {
    res.status(500).json({ message: "Forbidden Error" });
  }
};

export default handler;
