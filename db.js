  
const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER By id DESC LIMIT 4`;
    return db.query(q);
};


module.exports.uploadImage = (url,username, title, description) => {
    const q = 'INSERT INTO images (url,username, title, description) VALUES ($1,$2,$3,$4);';
    return db.query(q,[url,username, title, description ]).then((results)=> console.log("results:", results) ).catch((err)=> console.log("error", err));
};

module.exports.uploadImage2 = (title, username, description, fileName) => {
    const q = `INSERT INTO images (title, username, description, url) VALUES ($1, $2, $3, $4) RETURNING title, username, description, url, id`;
    return db.query(q, [title, username, description, 'https://s3.amazonaws.com/pulse-today/' + fileName]);
};

module.exports.getModal = (id) => {
    q = `SELECT * FROM images WHERE id = $1`;
    return db.query(q, [id]);
};

module.exports.getComments = (id) => {
    q = 'SELECT * FROM comments WHERE idimage = $1';
    return db.query(q, [id]);
};

module.exports.insertComment = (comment, username, id) => {
    q = 'INSERT INTO comments (comment,username, idimage) values ($1, $2,$3) RETURNING comment, username';
    return db.query(q, [comment, username,id]);
};

module.exports.getMoreImages = id => {
    return db.query(
        `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 4`, [id]);
};


