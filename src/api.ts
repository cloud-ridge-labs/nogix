export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
}

type APIResponse = {
  choices: {
    message: {
      content: string | null;
    };
  }[];
};

export async function askModel(messages: ChatMessage[]): Promise<string> {
  const baseURL = process.env.NOGIX_BASE_URL;
  const apiKey = process.env.NOGIX_API_KEY;
  const model = process.env.NOGIX_MODEL;
  const thinking = process.env.NOGIX_THINKING;

  if (!baseURL || !apiKey || !model) {
    throw new Error("缺少模型API配置");
  }
  if (thinking !== "enabled" && thinking !== "disabled") {
    throw new Error("THINKING配置无效");
  }

  const response = await fetch(
    `${baseURL.replace(/\/+$/, "")}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages,
        thinking: { type: thinking },
        stream: false,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`API 请求失败：HTTP ${response.status}`);
  }

  const data = (await response.json()) as APIResponse;
  const content = data.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    throw new Error("模型没有返回有效文本");
  }

  return content;
}
