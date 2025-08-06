const asyncHsandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.error(err);
        res.status(500).json({ error: err.message });
    });
    };

export default asyncHsandler;