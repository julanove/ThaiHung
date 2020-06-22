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
   
    url: "https://thaihung.herokuapp.com/",

    database: {
        host: "18.178.72.199",
        user: 'yukina',
        password: 'yukina@123',
        database: 'yukina',
        multipleStatements: true
    },
}
};
module.exports = config;

