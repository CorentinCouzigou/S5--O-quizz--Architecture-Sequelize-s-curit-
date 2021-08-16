const { Answer, Level, Question, Quiz, Tag, User } = require('../models');

module.exports = {

    quiz: async (request, response, next) => {
        try {
           

            const quiz = await Quiz.findByPk(request.params.id, {
                include: [
                    'author',
                    'tags',
                    {
                        association: 'questions',
                        include: ['level', 'answers']
                    }
                ],
                order: [['questions', 'level_id', 'ASC'], ['questions', 'answers', 'description', 'desc']],
            });
            request.session.quiz = quiz;
            // if (!request.session.user) {
            //     response.render('quiz', { quiz });
            //     return;
            // }
            response.render('play_quiz', { quiz, title: quiz.title });
            // console.log('quizquestions=',quiz);
        } catch (error) {
            console.error(error);
        }

    },
    quizResult: async (request, response) => {
        // je recupere mon quiz
        
        const quiz = request.session.quiz
        // je recupere les réponses de l'utilisateur sous forme d'un tableau avec les valeurs uniquement!
        let answersUser = Object.values(request.body);
       
        // console.log('answersUer=', answersUser);
        // je créé un constance pour les résultats et ainsi l'incrémenter ultérieurement.
        let results = 0;
        let goodReponse = [];
        let badReponse = []
        // je demande à la base donnée de toutes les bonnes réponses.
        // je pense que ma demande n'est pas bonne et c'est la ou je me suis trompé?
        try {
            const answers = await Question.findAll({
                include: 'good_answer',
            });
            // je fais une boucle dans une boucle pour comparer les résultats
            //ici je boucle dans mes question pour avoir l'id des bonnes réponses de la BDD
            for (let good_answers of answers){
                // console.log('good_answers=', good_answers.id)
                // je boucle sur les réponses de l'utilisateur 
                for (let response of answersUser) {
                    // je transforme les réponses du user en nombre
                    let responseNumber = +response;
                    // console.log(response);

                    // je réalise ma comparaison
                    if (good_answers.id === responseNumber) {
                        
                        goodReponse.push(good_answers.id);
                        

                        // j'obtient bien un resultat mais pour chaque reponse et pas pour chaque bonne reponse...
                            results++                            
                        }
                    if (good_answers.id !== responseNumber) {
                    badReponse.push(responseNumber)
                   
                }

                
                }           
            }
            // je rends ma mon resultat sur une nouve views avec mes données.
            // console.log('results=', results);
 
            response.render('play_quiz', {quiz, results, goodReponse, badReponse})
        } catch (error) {
            console.error(error);
        }

    }

};