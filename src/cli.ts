import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askModel,type ChatMessage } from "./api.js";

//交互接口
const rl = createInterface({input,output});
const messages: ChatMessage[] = [];
console.log("What Should We Do? Nogix!");
console.log(`Model: ${process.env.NOGIX_MODEL}`);
console.log(`Thinking: ${process.env.NOGIX_THINKING}`);

//核心代码
while (true) {
  const message = await rl.question("You > ");
  if(message.trim() === "/exit") {
    console.log("Goodbye!");
    break;
  }
  if(!message.trim()){continue;}
  messages.push({ role: "user",content: message });
  try{
    const answer = await askModel(messages);
    messages.push( {role: "assistant",content: answer});
    console.log(`Nogix > ${answer}`);
  }catch(error){
    //如果失败，就出栈用户原本的消息
    messages.pop();
    console.error(
      "Nogix > 发生了错误:",
      error instanceof Error ? error.message: String(error)
    );
  }
}
rl.close();