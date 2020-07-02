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

    secret: "BNMLOCALBNM",
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
    secret: "BNMDEVBNM",
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
    secret: "BNMPRDBNM",
}
};
module.exports = config;

