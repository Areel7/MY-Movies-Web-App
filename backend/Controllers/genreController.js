import Genre from "../Models/Genre.js"; 
import asyncHandler from "../Middlewares/asyncHandler.js";

const createGenre = asyncHandler(async (req, res) => {

    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }

        const existingGenre = await Genre.findOne({name});

        if (existingGenre) {
            return res.status(400).json({ error: "Genre already exists" });
        }

        const genre = await new Genre({ name }).save();
        return res.status(200).json(genre)

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
});


const updateGenre = asyncHandler(async (req, res) => {

    try{
    const {name} = req.body;
    const { id } = req.params;

    const genre = await Genre.findOne({_id: id });

    if (!genre) {
        return res.status(404).json({ error: "Genre not found" });
    }

    genre.name = name;

    const updatedGenre = await genre.save();
    return res.status(200).json(updatedGenre);
   }catch (error) {
        console.log(error);
        return res.status(400).json({error: "Internal server error"});
    }

});

const removeGenre = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const removed = await Genre .findByIdAndDelete(id);
        if (!removed) {
            return res.status(404).json({ error: "Genre not found" });
        }
        return res.status(200).json(removed);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Internal server error" });
    }
});

const listGenres = asyncHandler(async (req, res) => {
    try {
        const genres = await Genre.find({});
        
        if (!genres || genres.length === 0) {
            return res.status(404).json({ error: "No genres found" });
        }

        return res.status(200).json(genres);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Internal server error" });
    }
});

const readGenre = asyncHandler(async (req, res) => {

    try {
        const { id } = req.params;

        const genre = await Genre.findById(id);
        if (!genre) {
            return res.status(404).json({ error: "Genre not found" });
        }

        return res.status(200).json(genre);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: "Internal server error" });
    }
});

export { createGenre, updateGenre, removeGenre, listGenres, readGenre };