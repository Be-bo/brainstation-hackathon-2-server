require('dotenv').config();
const OpenAI = require("openai");
const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const axios = require('axios');
const {CORS_ORIGIN} = process.env;
const openai = new OpenAI();

app.use(cors({origin: CORS_ORIGIN}));
app.use(express.json());


// MARK: REST
app.get('/', (req, res) => {
  console.log(req.body);
  console.log("Hello Express!");
});





app.post('/chat', async (req, res) =>{
  // console.log(req.body);
  const prompt =
  getCompletePrompt(
    req.body.response_type,
    req.body.desired_role,
    req.body.skills,
    req.body.experience,
    req.body.education,
    req.body.interests,
  )
  console.log(prompt);

  try{
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
  
    console.log(completion.choices[0]);
    res.send(completion.choices[0]);
  }catch(e){
    res.status(500).json({ error: 'Chat request failed.' });
  }
});





app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



// MARK: Helper Functions
function getCompletePrompt(responseType, desiredRole, skills, experience, education, interests){
  const joinedSkills = skills.join('\n');
  const joinedExperience = experience.join('\n');
  const joinedEducation = education.join('\n');
  const joinedInterests = interests.join('\n');

  switch(responseType){
    case 0:
      return getToDoNextString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests);
    case 1:
      return getWhatMissingString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests);
    case 2:
      return getJobRightNowString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests);
  }
}

function getJobRightNowString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests){
  const finalString =
  `I am someone who is looking to switch their career to a new industry. I'm going to provide you details on my background. Please give me a very specific, tailored response. Furthermore make the response long and avoid making it sound generic. The fundamental question you're trying to answer for me is "What actionable, specific steps can I take to maximize my chances of switching my career from where I am at right now to becoming a ${desiredRole}?". Make sure you focus on the daily realities of applying and searching for that type of job. Especially as it relates to where I am at based on the info about me provided below. Don't get hung up on the traditional ways of getting in. With your response I'm really looking for something tangible that will help me take action NOW. I want to know that I'm taking the best next steps to get a job in the new field as soon as possible. Feel free to suggest lower seniority / level roles or related roles to the role I'm looking for. Especially if I seem more qualified for those at the moment. My background:
  ${joinedExperience}
  These are my skills:
  ${joinedSkills}
  This is my education history:
  ${joinedEducation}
  These are my interests:
  ${joinedInterests}
  -That's it, thanks so much! And remember, do NOT under any circumstance omit responding to anything I've asked you to respond to above. Address every single request I made above based on the information about me. Even if that means going very long with the response...`

  return finalString;
}

function getWhatMissingString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests){
  const finalString =
  `I am someone who is looking to switch their career to a new industry. I'm going to provide you details on my background. Please give me a very specific, tailored response. Furthermore make the response long and avoid making it sound generic. The fundamental question you're trying to answer for me is "From my current work I want to pivot to ${desiredRole}. What crucial skills and experience am I missing?". Answer the question in a very tangible way giving me insight into all the new demands this career would put on me. List out the major missing elements, skills, experience, and qualifications that people in this role typically have and how suggest to me actionable ways on bridging that gap. What are the unexpected things? Especially as it relates to "getting the job in practice" vs "official job requirements". This is my current background:
  ${joinedExperience}
  These are my skills:
  ${joinedSkills}
  This is my education history:
  ${joinedEducation}
  These are my interests:
  ${joinedInterests}
  - That's it, thanks so much! And remember, do NOT under any circumstance omit responding to anything I've asked you to respond to above. Address every single request I made above based on the information about me. Even if that means going very long with the response...`

  return finalString;
}

function getToDoNextString(desiredRole, joinedSkills, joinedExperience, joinedEducation, joinedInterests){
  const finalString =
  `I am someone who is looking to switch their career to a new industry. I'm going to provide you details on my background. Please give me a very specific, tailored response. Furthermore make the response long and avoid making it sound generic. The fundamental question you're trying to answer for me is "What skills should I learn next and what actions should I take next to get closer to getting a job as a ${desiredRole}?". Take into consideration what the role typically requires and what people have had to do historically to get it, from both the soft and the hard skills points of view. Also, what experience is typically required. Also, what are the big unexpected things that I might be missing as someone who's originally coming from this background:
  ${joinedExperience}
  These are my skills:
  ${joinedSkills}
  This is my education history:
  ${joinedEducation}
  These are my interests:
  ${joinedInterests}
  - That's it, thanks so much! And remember, do NOT under any circumstance omit responding to anything I've asked you to respond to above. Address every single request I made above based on the information about me. Even if that means going very long with the response...`

  return finalString;
}