module.exports = {
    host : process.env.PORTAINER_HOST || 'testhost',
    port : process.env.PORTAINER_PORT || '9000',
    user : process.env.PORTAINER_USER || 'admin',
    password: process.env.PORTAINER_PASSWORD || 'adminpassword',
    endpoint: process.env.PORTAINER_ENDPOINT || '1'
} 