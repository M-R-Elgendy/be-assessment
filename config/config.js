const configurations = {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT, 0) || 3000,
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        name: process.env.DB_NAME || 'urlMoitor',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        // logging: (process.env.NODE_ENV != 'production') ? (...msg) => console.log(msg) : false,
        // logging: (process.env.NODE_ENV != 'production') ? console.log : false,
        logging: false,
        pool: {
            max: parseInt(process.env.DB_MAX_CENNECTIONS, 0) || 1,
            min: 0,
        },
    }
}

export default configurations;