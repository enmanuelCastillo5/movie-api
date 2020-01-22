const express = require('express');
const MoviesService = require('../services/movies')

const { movieIdSchema, createMovieSchema, updateMovieSchema } = require('../utils/schemas/movies')
const validationHandler = require('../utils/middleware/validationHandler')
const cacheResponse = require('../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../utils/time');


function moviesApi(app) {
    const router = express.Router();
    app.use('/api/movies', router);

    const moviesService = new MoviesService();
//          GET  MOVIESSSS       //
    router.get('/', async function(request, response, next) {
        cacheResponse(request, FIVE_MINUTES_IN_SECONDS);
        const { tags } = request.query;
        try {
            const movies = await moviesService.getMovies({ tags })
            response.status(200).json({
                data: movies,
                message: 'movies retrieved'
            });
        } catch (error) {
            next(error);
        }
    });



//          para el GET  MovieId       //
    router.get('/:movieId', validationHandler({movieId: movieIdSchema}, 'params'),  async function(request, response, next) {
        cacheResponse(request, SIXTY_MINUTES_IN_SECONDS);
        const { movieId } = request.params;

        try {
            const movies = await moviesService.getMovie({ movieId });
            response.status(200).json({
                data: movies,
                message: 'movie retrieved'
            });
        } catch (error) {
            next(error);
        }
    });

//             PARA EL CREATE       //
    router.post('/', validationHandler(createMovieSchema), async function(request, response, next) {
        const { body: movie } = request;
        try {
            const createMovieId = await moviesService.createMovie({ movie });
            response.status(201).json({
                data: createMovieId,
                message: 'movie created'
            });
        } catch (error) {
            next(error);
        }
    });

//          PARA EL PUT         //
    router.put('/:movieId', validationHandler({ movieId: movieIdSchema}, 'params'), validationHandler(updateMovieSchema), async function(request, response, next) {
        const { movieId } = request.params;
        const { body: movie } = request;
        try {
            const updateMovieId = await moviesService.updateMovie({ movieId, movie})
            response.status(200).json({
                data: updateMovieId,
                message: 'movie updated'
            });
        } catch (error) {
            next(error);
        }
    });

    //          PARA EL PATCH           //

    router.patch('/:movieId', async function(request, response, next) {
        const {body: movie } = request;
        try {
            const patchedMovie = moviesService.patchMovie({ movie });
            response.status(200).json({
                data: patchedMovie,
                message: 'movie patched'
            })
        } catch (error) {
            next(error)
        }
    } )

//              PARA EL DELETE          //
    router.delete('/:movieId', validationHandler({ movieId: movieIdSchema}, 'params'), async function(request, response, next) {
        const { movieId } = request.params;
        try {
            const deleteMovie = await moviesService.deleteMovie({ movieId })
            response.status(200).json({
                data: deleteMovie,
                message: 'movie deleted'
            });
        } catch (error) {
            next(error);
        }
    });

}

module.exports =  moviesApi;