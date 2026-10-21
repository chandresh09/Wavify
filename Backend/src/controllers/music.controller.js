const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");
const jwt = require("jsonwebtoken");

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;
    const user = req.user;

    const result = await uploadFile(file.buffer.toString("base64"));

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: user.id
    });

    res.status(201).json({
        message: "Music Created Successfully",
        music: {
            id: music._id,
            uri: music.uri,
            title: music.title,
            artist: music.artist
        }
    });

}

async function createAlbum(req, res) {

    const { title, musics } = req.body;
    const user = req.user;

    const album = await albumModel.create({
        title,
        musics: musics,
        artist: user.id
    });

    res.status(201).json({
        message: "Album Created Successfully",
        album: {
            id: album._id,
            title: album.title,
            musics: album.musics,
            artist: album.artist
        }
    });

}

async function getAllMusics(req, res) {
    const musics = await musicModel.find().limit(10).populate("artist", "username email");

    res.status(200).json({
        message: "Musics Fetched Successfully",
        musics: musics
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "username email");

    res.status(200).json({
        message: "Albums Fetched Successfully",
        albums: albums
    });
}

async function getAlbumId(req, res) {
    const albumId = req.params.albumId;

    const album = await albumModel.findById(albumId).populate("musics").populate("artist", "username email");

    res.status(200).json({
        message: "Album Fetched Successfully",
        album: album
    });
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumId }