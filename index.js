const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connect = require("./src/utils/database")

const Movie = require("./src/models/movie.model")

const PORT = process.env.PORT;

const server = express();
const router = express.Router();

connect();

router.get("/movies", (req, res) => {
    return Movie.find().then(movies => {
        return res.status(200).json(movies);
    }).catch(error => {
        return res.status(500).json(error);
    });
});


router.get("/movies/:id", async (req, res) => {
    const id = req.params.id;
        try {
            const movie = await Movie.findById(id);
            if(movie) {
                return res.status(200).json(movie);
            } else {
                return res.status(404).json("No movie found in DB");
            }
        } catch (error) {
            return res.status(500).json(error);
        }
});

//Ahora en vez de buscar por id vamos a buscar por title, para ello tendremos que crear una subruta más, si no va a prevalecer el id porque está arriba y el código se ejecuta en cascada

router.get("/movies/title/:title", async (req, res) => {
    const title = req.params.title;
    try {
        const movie = await Movie.find({ title: title });
        if(movie) {
            return res.status(200).json(movie);
        } else {
            return res.status(404).json("No movie found in DB");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

//Ahora lo que queremos es que nos devuelva las peliculas según su género, es lo mismo que lo de arriba, tenemos que crear otra subruta pero en este caso con el género

router.get("/movies/genre/:genre", async (req, res) => {
    const genre = req.params.genre;
    try {
        const movie = await Movie.find({ genre: genre });
        if(movie) {
            return res.status(200).json(movie);
        } else {
            return res.status(404).json("No movie found in DB");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

//ahora lo que nos pide el ejercicio es que muestre solo las movies que se han estrenado a partir de 2010

router.get("/movies/yearGreaterThan/:year", async (req, res) => {
    const year = req.params.year;
    try {
        const movie = await Movie.find({ year: { $gt:year } });
        return res.status(200).json(movie); 
    } catch (error) {
        return res.status(500).json(error);
    }
})

server.use("/api/v1", router);
 
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
}); 