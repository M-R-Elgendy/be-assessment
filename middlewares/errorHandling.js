const handelError = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Internal Server Error' });
    } else {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

export default handelError;