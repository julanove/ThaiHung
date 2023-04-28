var config = {
  local: {

    url: "http://localhost",

    database: {
      host: "localhost",
      user: 'root',
      password: 'admin01',
      database: 'tha38223_thaihung',
      multipleStatements: true
    },

    secret: "BNMLOCALBNM",
  },
  development: {
  
    url: "http://localhost",
   
    database: {
          host: "localhost",
          user: 'root',
          password: 'admin01',
          database: 'tha38223_thaihung',
          multipleStatements: true
      },
    secret: "BNMDEVBNM",
  },
  
production: {
   
    url: "https://thaihung.herokuapp.com/",

    database: {
      host: "localhost",
      user: 'root',
      password: 'admin01',
      database: 'tha38223_thaihung',
      multipleStatements: true
    },
    secret: "BNMPRDBNM",
}
};
module.exports = config;

