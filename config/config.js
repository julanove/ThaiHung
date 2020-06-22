var config = {
  local: {

    url: "http://localhost:1337/",

    database: {
      host: "18.178.72.199",
      user: 'yukina',
      password: 'yukina@123',
      database: 'yukina',
      multipleStatements: true
    },
  },
  development: {
  
    url: "https://thaihung.herokuapp.com/",
   
    database: {
      host: "18.178.72.199",
      user: 'yukina',
      password: 'yukina@123',
      database: 'yukina',
      multipleStatements: true
    },
  },
production: {
   
    url: 'http://my.site.com',

    database: {
        host: '127.0.0.1',
        port: '27017',
        db:     'site'
    },
}
};
module.exports = config;

