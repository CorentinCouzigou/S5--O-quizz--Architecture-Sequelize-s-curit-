const { Tag } = require('../models');

module.exports = {

    tag: async (request, response, next) => {
        try {
            const tag = await Tag.findByPk(request.params.id, {
                include: { 
                    association: 'quizzes',
                    include : 'author'
                }
            });

            if(!tag){
                return next();
            }

            response.render('tag', { tag });
        } catch (error) {
            response.status(500).render('tags', { tags: [], error: `Une erreur est survenue` });
        }
    },

    tagList: async (request, response) => {
        try {
            const tags = await Tag.findAll();
            response.render('tags', { tags });
        } catch (error) {
            response.status(500).render('tags', { tags: [], error: `Une erreur est survenue` });
        }
    },

    tagListSansAsync: (request, response) => {
    
        Tag.findAll().then(tags => {
            response.render('tags', { tags });
        }).catch(error => {
            console.error(error);
            response.status(500).render('tags', { tags: {}, error: `Une erreur est survenue` });
        });
    }

}