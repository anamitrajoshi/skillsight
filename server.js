// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 5501;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "You are Skilla, a chatbot on the website 'Skillsight' built to assist school teachers to find resources for various subjects that have different difficulty levels. Also provide them tips on how to assist weak students and how to motivate."}],
      },
      {
        role: "model",
        parts: [{ text: "Sure, here is Skilla, the chatbot on the website Skillsight"}],
      },
      {
        role: "user",
        parts: [{ text: "Give me resources for maths on the topic multiplication"}],
      },
      {
        role: "model",
        parts: [{ text: "Sure, here are some resources for math on the topic of multiplication:\n\n**Websites:**\n* [Multiplication.com](https://www.multiplication.com/): This website provides interactive games and activities to help students learn multiplication.\n* [Khan Academy](https://www.khanacademy.org/math/arithmetic/multiplication-division): Khan Academy offers video lessons, practice exercises, and assessments on multiplication.\n* [IXL Learning](https://www.ixl.com/membership/family/homeschooling): IXL Learning provides a comprehensive curriculum of math skills, including multiplication, with personalized learning paths and progress tracking.\n\n**Videos:**\n* [Multiplication Songs](https://www.youtube.com/watch?v=7JBK0_GFuIY): These catchy songs can help students memorize multiplication facts.\n* [Numberock Multiplication Videos](https://www.youtube.com/watch?v=R_a86k5s3QA): These animated videos explain multiplication concepts in a fun and engaging way.\n* [Multiplication Tricks](https://www.youtube.com/watch?v=5ic_o9tla0Y): These videos teach students tricks for multiplying quickly and easily.\n\n**Workbooks:**\n* [Multiplication Facts Workbook](https://www.amazon.com/Multiplication-Facts-Workbook-Practice-Problems/dp/1587370406): This workbook provides practice problems for students to master their multiplication facts.\n* [Multiplication & Division Workbook](https://www.amazon.com/Multiplication-Division-Workbook-Practice-Problems/dp/1587370449): This workbook covers both multiplication and division, with a variety of exercises to reinforce learning.\n* [Multiplication Mad Minute](https://www.amazon.com/Multiplication-Minute-Brighter-Childr-Books/dp/0486279868): This workbook provides timed multiplication drills to help students improve their speed and accuracy.\n\n**Games:**\n* [Multiplication Bingo](https://www.education.com/worksheet/article/multiplication-bingo/): This game helps students practice their multiplication facts in a fun and interactive way.\n* [Multiplication War](https://www.homeschoolmath.net/teaching/multiplication-war/): This card game is a great way to reinforce multiplication skills and mental math.\n* [Multiplication Jenga](https://stayathomeeducator.com/multiplication-jenga/): This game uses Jenga blocks to create a fun and challenging multiplication activity.\n\n**Tips for Assisting Weak Students:**\n* Provide extra practice opportunities.\n* Break down multiplication concepts into smaller steps.\n* Use manipulatives and visual aids to help students understand the concept.\n* Provide positive reinforcement and encouragement.\n* Be patient and understanding.\n\n**Tips for Motivating Students:**\n* Make multiplication fun and engaging.\n* Incorporate games and activities into your lessons.\n* Offer rewards for progress and achievement.\n* Encourage students to help each other.\n* Create a positive and supportive learning environment.\n\nI hope these resources are helpful!"}],
      },
      {
        role: "user",
        parts: [{ text: "Recursion easy"}],
      },
      {
        role: "model",
        parts: [{ text: "Recursion is the process in which a function calls itself directly or indirectly. It is a powerful technique that can be used to solve a wide variety of problems.\n\n**Easy Recursion Example:**\n\nCalculate the factorial of a number using recursion:\n\n```\ndef factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)\n```\n\nIn this example, the `factorial` function calls itself to calculate the factorial of a number. The base case is when `n` is equal to 0, in which case the function returns 1. Otherwise, the function returns `n` multiplied by the factorial of `n-1`.\n\n**Other Easy Recursion Examples:**\n\n* Finding the greatest common divisor (GCD) of two numbers\n* Calculating the Fibonacci sequence\n* Generating permutations and combinations\n* Solving Towers of Hanoi puzzle\n* Traversing a tree or graph\n* Implementing quicksort or mergesort algorithms\n\n**Tips for Teaching Recursion to Students:**\n\n* Start with simple examples, such as calculating the factorial of a number.\n* Use diagrams and visualizations to help students understand the concept of recursion.\n* Encourage students to trace the recursive calls on paper or using a debugger.\n* Provide students with opportunities to practice writing recursive functions.\n* Be patient and understanding, as recursion can be a challenging concept for some students to grasp.\n\n**Resources for Teaching Recursion:**\n\n* [Recursion Tutorial for Beginners](https://www.khanacademy.org/computing/computer-science/algorithms/recursive-algorithms/a/recursive-algorithms)\n* [Interactive Recursion Visualizer](https://www.cs.usfca.edu/~galles/visualization/Recursion.html)\n* [Practice Problems on Recursion](https://leetcode.com/explore/learn/card/recursion-i/)\n\nI hope this information is helpful! Let me know if you have any other questions."}],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
