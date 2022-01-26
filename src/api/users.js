import axios from "axios";
import { ApiUrl } from "../Url";


export async function loginUser(username, password) {
    try {
      const request = await axios({
        method: "POST",
        url: `${ApiUrl}`,
        headers: { "username": `${username}`,"password": `${password}` },
      })
      return request;
    } catch (err) {
      console.error(err.message);
      return undefined
    }
  }


