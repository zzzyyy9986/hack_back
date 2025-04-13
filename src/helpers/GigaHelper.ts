import axios from "axios";
import { gigaClientId, gigaScope } from "../env";

export interface gigaResponse {
  choices: {
    message: {
      content: string;
      role: string;
      index: number;
      finish_reason: string;
    };
  }[];
  created: number;
  /**
   * GigaChat:1.0.26.20
   */
  model: string;
  /**
   * chat.completion
   */
  object: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    precached_prompt_tokens: number;
  };
}

export const getToken = async () => {
  const { v4: uuidv4 } = require("uuid");

  const qs = require("qs");
  const axios = require("axios");

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://ngw.devices.sberbank.ru:9443/api/v2/oauth",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      RqUID: uuidv4(),
      Authorization: `Basic ${gigaClientId}`,
    },
    data: qs.stringify({
      scope: gigaScope,
    }),
  };

  try {
    const response = await axios(config);
    const { access_token: accessToken, expires_at: expiresAt } = response.data;

    return { accessToken, expiresAt };
  } catch (error) {
    console.log(error);
  }
};

export class GigaHelper {
  /**
   * Сделать запрос к gigaChat
   * @param content
   * @param system
   */
  public static async gigaQuery(
    content = "",
    system = ""
  ): Promise<gigaResponse | undefined> {
    // if (!content) return;

    const token: any = await getToken();

    const messages = [];
    if (system) {
      messages.push({ role: "system", content: system });
    }

    const data = JSON.stringify({
      model: "GigaChat",
      messages: messages.concat([
        {
          role: "user",
          content,
        },
      ]),
      profanity_check: true,
      // temperature: 1,
      // top_p: 0.4,
      // n: 2,
      // stream: false,
      max_tokens: 512,
      // repetition_penalty: 1,
      // update_interval: 0,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://gigachat.devices.sberbank.ru/api/v1/chat/completions",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token.accessToken}`,
      },
      data,
    };

    try {
      const response = await axios(config);
      return response.data;
      const message = response.data.choices[0].message;
      return message.content;
    } catch (e) {
      console.log("Ошибка!!!!!");
      console.log(e);
    }
  }
  public static async getGigaEmbedings(text: string) {
    const axios = require("axios");
    const token: any = await getToken();
    let data = JSON.stringify({
      model: "Embeddings",
      input: text,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://gigachat.devices.sberbank.ru/api/v1/embeddings",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token.accessToken,
      },
      data: data,
    };

    try {
      const gigaResp = await axios(config);
      if (gigaResp.data) {
        return gigaResp.data;
      }
    } catch (e) {
      console.log(e);
    }
  }
}
