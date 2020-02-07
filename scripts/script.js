// #########################################################################################################################
// QUIZ CONTROLLER ########################################################################################################
var QuizController = (function() {

    var theQuiz = function(question , possibeAnswers , correctAnswer) {
        this.question       = question;
        this.possibeAnswers = possibeAnswers;
        this.correctAnswer  = correctAnswer;
        this.chosenAnswer   = 0;
        this.score          = 0;
    }

    theQuiz.prototype.addChosenAnswer = function(index) {
        this.chosenAnswer = index;
    }
    
    theQuiz.prototype.calcScoreEach = function(index) {
        if(this.chosenAnswer === this.correctAnswer) { this.score = 25; }
        else { this.score = 0; }
    }
    
    var quiz1 = new theQuiz();
    quiz1.question = 'What term describes a newly born horse?';
    quiz1.possibeAnswers = ['Kit' , 'Foal' , 'Puppy'];
    quiz1.correctAnswer = 1;
    
    var quiz2 = new theQuiz();
    quiz2.question = 'Which field of physics deals with the actions and relations of heat?';
    quiz2.possibeAnswers = ['Fluid Mechanics' , 'Astrology' , 'Thermodynamics'];
    quiz2.correctAnswer = 2;
    
    var quiz3 = new theQuiz();
    quiz3.question = 'What is the SI unit of force?';
    quiz3.possibeAnswers = ['Sagan' , 'Einstein', 'Newton'];
    quiz3.correctAnswer = 2;

    var quiz4 = new theQuiz();
    quiz4.question = 'Which type of electromagnetic radiation has the shortest wavelength?';
    quiz4.possibeAnswers = ['Microwaves' , 'Hand waves','Gamma Rays'];
    quiz4.correctAnswer = 2;

    var quiz5 = new theQuiz();
    quiz5.question = 'Which term describes light as it changes direction when going from one medium into another?';
    quiz5.possibeAnswers = ['Refraction' , 'Metamorphosis' , 'Assimilation'];
    quiz5.correctAnswer = 0;
    
    var allQuestions = [quiz1 , quiz2 , quiz3 , quiz4 , quiz5];

    var finalListOfQuestions = allQuestions;

    var shuffle = function(array) {
        var i = array.length, j = 0, temp;
        while (i--) {
            j = Math.floor(Math.random() * (i+1));
            // swap randomly chosen element with current element
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
      
    var calcTotalScore = function() {
        var sum = 0;

        for(var i = 0; i < finalListOfQuestions.length ; i++) {
            finalListOfQuestions[i].calcScoreEach();
        }
        
        for(var i = 0; i < finalListOfQuestions.length ; i++) {
            sum = sum + finalListOfQuestions[i].score;
        }

        console.log(sum);
        return sum;
    };

    var calcMaximumScore = function() {  return finalListOfQuestions.length * 25 ;  }

    return {
        
        setNumberOfQuestions: function(num) {
           var newArray = shuffle(allQuestions);
            finalListOfQuestions = newArray.slice(0,num);
            console.log(finalListOfQuestions);
            console.log(allQuestions);
        }, 


        getQuestions: function() {
            return finalListOfQuestions;
        },

        getMaxScore: function() {
            return calcMaximumScore();
        },

        getFinalScore: function() {
            return calcTotalScore();
            // console.log(allQuestions);
        },

        resetData: function() {
            for(var i = 0 ; i < finalListOfQuestions.length ; i++) {
                finalListOfQuestions[i].chosenAnswer = 0;
                finalListOfQuestions[i].score = 0;
            }
            console.log(allQuestions);
            console.log(finalListOfQuestions);
        }
    }

    

})();



// ######################################################################################################################
// UI ####################################################################################################################
var UIController = (function() {

    var DOMStrings = {
            container: document.querySelector('.container'),
            numOfQuestionsToPlay: document.querySelector('.number-of-questions-to-play'),
            startButton: document.querySelector('.start-button'),
            numOfQuestionsInput: document.querySelector('.number-of-questions-to-play'),
            startPageContainer: document.querySelector('.start-page-container'),
            questionContainer: document.querySelector('.question-container'),
            questionNumberDisplay: document.querySelector('.question-container__title'),
            allPossibleAnswer: document.getElementsByName('possible-answer'),
            nextButton: document.querySelector('.next-question-button'),
            scoreButton: document.querySelector('.score-button'),
            theQuestion: document.querySelector('.question'),
            option_1_text: document.querySelector('.option-1-text'),
            option_2_text: document.querySelector('.option-2-text'),
            option_3_text: document.querySelector('.option-3-text'),
            resultsContainer: document.querySelector('.results-container'),
            scoreOutput: document.querySelector('.results-container__score'),
            playAgainButton: document.querySelector('.play-again-button'),
            answersContainer: document.querySelector('.answers-container'),
            tableBody: document.querySelector('.table__body'),
            answersButton: document.querySelector('.answers-button'),
            goBackButton: document.querySelector('.go-back-button')
    };

    var clearRadioButtons = function() {
        var optionsList = DOMStrings.allPossibleAnswer;
        for(var i = 0 ; i < optionsList.length ; i++) {
            optionsList[i].checked = false;
        }
    }


    return {
        getDOMStrings: function(){
            return DOMStrings;
        },

        NumberOfQuestionsInput: function() {
            var q , q_text , q_final;
            q = DOMStrings.numOfQuestionsToPlay;  // this is the select element.
            // q = document.querySelector('.number-of-questions-to-play');
            q_text = q.options[q.selectedIndex].text;
            
            q_final = parseInt(q_text);
            console.log(q_final);
            console.log(typeof(q_final));

            return q_final;
        },

        startQuiz: function() {
            DOMStrings.startPageContainer.classList.remove('show');
            DOMStrings.questionContainer.classList.add('show');
        },

        displayQuestion: function(quiz,index){
            clearRadioButtons();
            DOMStrings.questionNumberDisplay.innerText  = 'Question Number ' + (index+1); 
            DOMStrings.theQuestion.innerText            = quiz.question;
            DOMStrings.option_1_text.innerText          = quiz.possibeAnswers[0];
            DOMStrings.option_2_text.innerText          = quiz.possibeAnswers[1];
            DOMStrings.option_3_text.innerText          = quiz.possibeAnswers[2];
        },
    
        selectedAnswersIndex: function() {
            var optionsList = DOMStrings.allPossibleAnswer;
            var checkedItem;
            for(var i = 0 ; i < optionsList.length ; i++) {
                if(optionsList[i].checked)
                {
                    checkedItem = i;
                }
            }
            return checkedItem;
        },
    
        showScoreButton: function(){
            DOMStrings.nextButton.classList.remove('show');
            DOMStrings.scoreButton.classList.add('show');
        },

        hideScoreButton: function(){
            DOMStrings.nextButton.classList.add('show');
            DOMStrings.scoreButton.classList.remove('show');
        },

        loadScorePage: function() {
            DOMStrings.questionContainer.classList.remove('show');
            DOMStrings.resultsContainer.classList.add('show');
        },

        displayFinalScore: function(finalScore , maxScore) {
            DOMStrings.scoreOutput.innerText =  finalScore + '/' + maxScore;
        },

        displayAnswers: function(questions) {
            var html , newHtml, status, choseAnswerClass;

            for(var i = 0 ; i < questions.length ; i++) {
                html = '<tr><td> %number% </td><td> %question% </td><td class="table-correct-answer"> %correct-answer% </td><td class="%chosen-answer-class%"> %chosen-answer% </td><td> %status% </td></tr>';
                newHtml = html.replace('%number%', i+1);
                newHtml = newHtml.replace('%question%', questions[i].question);
                newHtml = newHtml.replace('%correct-answer%', questions[i].possibeAnswers[questions[i].correctAnswer]);
                newHtml = newHtml.replace('%chosen-answer%', questions[i].possibeAnswers[questions[i].chosenAnswer]);
                
                if(questions[i].score === 0) {
                    status = '&#10060;';
                    choseAnswerClass = 'chosen-answer-is-incorrect';
                } 
                else {
                    status = '&#10004;';
                    choseAnswerClass = 'chosen-answer-is-correct';
                }
                
                newHtml = newHtml.replace('%status%', status);
                newHtml = newHtml.replace('%chosen-answer-class%', choseAnswerClass);
                
                //insert HTML into the DOM
                console.log(newHtml);
                DOMStrings.tableBody.insertAdjacentHTML('beforeend' , newHtml);  // inserted as a last child of the element. 
            }
        },

        deleteDisplayedAnswers: function() {
            DOMStrings.tableBody.innerHTML = ''  // inserted as a last child of the element. 
        },

        loadAnswersPage: function() {
            DOMStrings.questionContainer.classList.remove('show');
            DOMStrings.resultsContainer.classList.remove('show');
            DOMStrings.startPageContainer.classList.remove('show');
            DOMStrings.answersContainer.classList.add('show');
            DOMStrings.container.classList.add('full-height');

        },

        loadStartPage: function() {
            DOMStrings.questionContainer.classList.remove('show');
            DOMStrings.resultsContainer.classList.remove('show');
            DOMStrings.startPageContainer.classList.add('show');
        },

        goBack:function() {
            DOMStrings.questionContainer.classList.remove('show');
            DOMStrings.resultsContainer.classList.add('show');
            DOMStrings.startPageContainer.classList.remove('show');
            DOMStrings.answersContainer.classList.remove('show');
            DOMStrings.container.classList.remove('full-height');
        }
    };

})();




// ######################################################################################################################
//  GLOBAL APP CONTROLLER ###############################################################################################
var controller = (function(QuizCtrl , UICtrl) {
    var nextQuestionIndex = 0;
    console.log(nextQuestionIndex);

    var questions;
  

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        DOM.startButton.addEventListener('click', ctrlStartQuiz);
        DOM.nextButton.addEventListener('click', ctrlGotoNextQuestion);
        DOM.scoreButton.addEventListener('click', ctrlShowScore);
        DOM.playAgainButton.addEventListener('click', ctrlPlayAgain);
        DOM.answersButton.addEventListener('click', ctrlDisplayAnswers);
        DOM.goBackButton.addEventListener('click' , ctrlGoBack)

    };


    var ctrlStartQuiz = function() { 
        // console.log(UICtrl.getNumberOfQuestionToPlay());
        // console.log(questions);

        var numOfQuestionsInput = UICtrl.NumberOfQuestionsInput();
        QuizCtrl.setNumberOfQuestions(numOfQuestionsInput);
        // debugger;
        UICtrl.startQuiz();
        questions = QuizCtrl.getQuestions();
        UICtrl.displayQuestion(questions[nextQuestionIndex],nextQuestionIndex);
        nextQuestionIndex++;
        console.log(nextQuestionIndex);

    };

    var ctrlAddChosenAnswer = function() {
         var answerIndex = UICtrl.selectedAnswersIndex();
         questions[nextQuestionIndex-1].addChosenAnswer(answerIndex);
    };

    var ctrlGotoNextQuestion = function(){
        // if all questions displayed, go to the score page.
        if(nextQuestionIndex === questions.length-1) {
             UICtrl.showScoreButton();
        }

        //add the chosen answer to the current question object.
        ctrlAddChosenAnswer();

        //display next question
        UICtrl.displayQuestion(questions[nextQuestionIndex] , nextQuestionIndex);
        // console.log(questions);

        nextQuestionIndex++;
        console.log(nextQuestionIndex);

    };

    var ctrlShowScore = function() {
        //add the chosen answer to the current question object.
        ctrlAddChosenAnswer();

        UICtrl.loadScorePage();
        
        console.log(questions);

        var finalScore = QuizCtrl.getFinalScore();
        var maxScore = QuizCtrl.getMaxScore();
        
        UICtrl.displayFinalScore(finalScore,maxScore);
    };

    var ctrlPlayAgain = function() {
        nextQuestionIndex = 0;
        // console.log(nextQuestionIndex);
        QuizCtrl.resetData();
        UICtrl.deleteDisplayedAnswers();
        UICtrl.loadStartPage();
        UICtrl.hideScoreButton();
    };

    var ctrlDisplayAnswers = function() {
        UICtrl.loadAnswersPage();
        UICtrl.displayAnswers(questions);
    }

    var ctrlGoBack = function() {
        UICtrl.goBack();
    }

    return {
        init: function() {
            console.log('the app started');
            setupEventListeners();
        }
    }

})(QuizController,UIController);


controller.init();






























/*      IT DIDNT WORK !


setNumberOfQuestions: function(num) {
    var randomIndex;
    var alreadyPickedIndexList = [9999];
    var indexAlreadyPicked = 0   // 1 : yes it was picked | 0 : no it wasnt picked
    for(var i = 0; i < num ; i++) {
           
        randomIndex =  Math.floor(Math.random() * allQuestions.length  ); //=> between 0 and last index
        while(indexAlreadyPicked === 1) {
             randomIndex =  Math.floor(Math.random() * allQuestions.length );
             for(var j = 0 ; j < alreadyPickedIndexList.length ; j++) {
                 if(randomIndex === alreadyPickedIndexList[j]) {
                     indexAlreadyPicked = 1;
                     break;
                 } else { indexAlreadyPicked = 0 ;}
             }
        }
        alreadyPickedIndexList.push(randomIndex);
        finalListOfQuestions.push(allQuestions[randomIndex]);
    }
    console.log(finalListOfQuestions);
    console.log(alreadyPickedIndexList);
},
 */





























































