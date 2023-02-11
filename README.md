# kalimahApp 
The Quran-based web app is intended to strengthen your companionship with the Quran and Arabic language.


Kalimah - https://abdulaziz-mi.github.io/kalimah_app/
(since this is running on GitHub at the moment please be patient as it might take a minute to load)

 <img width="1439" alt="Screenshot 2023-02-10 at 15 31 22" src="https://user-images.githubusercontent.com/107209170/218256635-2d225088-90a1-4bff-9c0c-e6a7ce0bd230.png">

## :ledger: Table Of Content 

- [About](#beginner-about)
- [Technology](#zap-technology)
- [Challenge](#computer-challenge)
- [Development](#wrench-development)


##  :beginner: About

Add a detailed introduction about the project here, everything you want the reader to know.
This web app is designed to aid students of the Arabic language and the Quran, to immerse themselves in the Arabic language through the Quran. 

Anyone that has learnt another language beyond their mother tongue will tell say 'you must busy yourself with the language' they refer to reading, listening, and speaking the language. This app is designed for the user to fulfil that by listening, reading and pondering over Arabic verses and scholarly explanations.

## :zap: Technology
HTML | CCS and Bootstrap | Vanilla JavaScript.

This is a front-end app that makes API get requests for the verse data via Quran.com's API:
https://quran.api-docs.io/v4/getting-started/introduction


For this API I used Postman to help me with the header I had to develop a method of getting a verse index in this format ${01:01}
I used support/metadata.json which has each chapter of the Quran and their verse count alongside other information.

## :computer: Challenge

A random verse and its translation will be presented from the Quran. One word will be missing from the translation. The user is expected to read the Arabic verse and figure out the missing word from the translation, using the text input. After submitting the correct answer, a scholarly explanation of the verse will be displayed with a success message. There is also a reveal button in case the user gets stuck.

Translations often don't give the full meaning especially since Arabic is a rich language, so if you recall the correct meaning and understanding of the word then you are successful, It is about understanding.




## :wrench: Development

The project is in the beginning stage, I aim to make massive changes and add new features when I find the time.

Features and additions:
 - Multiple choice mode (Same concept of the challenge, but using clickable words instead of submitting via text input)
 - Backend (User login, User statistics)
 - Daily challenges
 - User preferences (Language, reciter, scholarly explanation)

