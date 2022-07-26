const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class TagsController {

  async index( request, response ) {
    const user_id = request.user.id;
    const tags = await knex("movie_tags").where({user_id});
    console.log(tags);
    return response.json();
  }


} module.exports = TagsController;