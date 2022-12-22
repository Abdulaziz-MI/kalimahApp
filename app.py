from flask import Flask
from flask import Blueprint, redirect, url_for, render_template, request
import requests
import json
import urllib3
from random import randint
import re
# Think about hte possibility of making it multiple choice rather than text input
# how to identify page refresh on flask and use this in if statement to make GET API call for a new verse
manager = urllib3.PoolManager()

getReqSwitch = False
verseDetails = {
    "verse": '',
    "surah": '',
    "number": '',
    "missingWord": ''
}
randomAyah = randint(1, 6236)
tafsir = ''
missingWordHtml = ''
showHidden = False
successMsg = ''
# English verse details
def getEnglishAyahDetails():
    global randomAyah
    # Verse details in english
    url = f"https://api.alquran.cloud/v1/ayah/{randomAyah}/en.hilali"
    responseEn = requests.get(url)
    json = responseEn.json()
    verse = json['data']['text']
    surah = json['data']['surah']['englishName']
    number = json['data']['numberInSurah']
    verse = verse.split(' ')
    randomWordIndex = randint(0,len(verse)-1)
    missingWord = re.sub('[:,\[\)\(\]\?\.\}\{;!\"]','', verse[randomWordIndex])
    verse[randomWordIndex] = "____"
    verse =  ' '.join(verse)
    return verse, surah, number, missingWord

# Arabic Verse Details
def getArabicAyahDetails():
    urlAr = f"https://api.alquran.cloud/v1/ayah/{randomAyah}/ar"
    responseAr = requests.get(urlAr)
    json = responseAr.json()
    verseAr = json['data']['text']
    return verseAr
    
# Verse tafsir in Arabic
def getTafsir():
    global randomAyah
    print("randomAyah")
    print(randomAyah)
    urlTaf = f"https://api.alquran.cloud/v1/ayah/{randomAyah}/ar.muyassar"
    responseTaf = requests.get(urlTaf)
    json = responseTaf.json()
    tafsir = json['data']['text']
    return tafsir
# group all data needed to start the challenge
def getVerseAndMissingWord():
    verse, surah, number, missingWord = getEnglishAyahDetails()
        
    verseAr = getArabicAyahDetails() 
    
    global verseDetails
    verseDetails = {
        "verse": verse,
        "surah": surah,
        "number": number,
        "missingWord": missingWord,
        "verseAr": verseAr,
    }
    
    return verseDetails

app = Flask(__name__, template_folder='templates', static_folder="static")

# the / is the default page with challenge explanation
@app.route("/")
def home():
    return render_template("index.html")

# This function is needed to make the challenge case-sensitive, check the user's input compared to the rigth answer, give a feedback message, and reveal the additional information only when the answer is correct
def checkUserInput(textInput, missingWord):
    missingWord = missingWord.lower()
    textInput = textInput.lower()
    if textInput == missingWord:
        showHidden = True
        tafsir = getTafsir()
        successMsg = 'Well done'
    else:
        showHidden = False
        tafsir = ''
        successMsg = 'Try again'
        
    return showHidden, tafsir, successMsg

# This is the Challenge endpoint where everything happens
@app.route("/challenge/", methods=["POST", "GET"])
def challenge():
    global randomAyah
    global tafsir
    global missingWord
    global showHidden
    global verseDetails
    global successMsg
    global getReqSwitch
    print("request.form")
    print(request.form)
# this is needed so that the user's answer is not inherited when the challenge is restarted.
    request.form.get('texInput['']')
    
# hiding the answer from the beginning
    if request.method == "GET" and getReqSwitch == False:
        print("get has been called")
        verseDetails = getVerseAndMissingWord()
        showHidden = False
        getReqSwitch = True
    
# Not sure how to explain this 
    if request.method == "POST":
        textInput = request.form.get("textInput")
        inputs = []
        for data in request.form:
            inputs.append(data)
        
        if ('submitBtn' in inputs) and showHidden == False:
            showHidden, tafsir, successMsg = checkUserInput(textInput, verseDetails['missingWord'])
# when the user gives up reveal the right answers, not sure how to explain this
        if 'revealBtn' in inputs:
            successMsg = ''
            if tafsir != '':
                randomAyah = randint(1, 6236)
                verseDetails = getVerseAndMissingWord()
                tafsir = ''
                showHidden = False
            else:
                tafsir = getTafsir()
                missingWordHtml = verseDetails['missingWord']
                showHidden = True
    
    return render_template("challenge.html", verseDetails = verseDetails, tafsir = tafsir, showHidden = showHidden, successMsg = successMsg)


if __name__ == "__main__":
    app.run(debug=True)


