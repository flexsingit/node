var config = {
    local: {
        mode: 'local',
        port: 3000,
        dbPort: 27017,
        dbPath: 'mongodb://localhost:27017/loginApi',
        secret:'nodeauthsecret',
        keyspaceName: 'mykeyspace',
        username: '',
        password: '',
        siteURL:'http://localhost:3000/'
    },
}
module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
}
