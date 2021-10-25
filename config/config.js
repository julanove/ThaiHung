var config = {
  local: {

    url: "http://localhost:3000/",

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
        host: "localhost:3306",
        user: 'tha38223_thaihung2',
        password: '@_Thaihung2',
        database: 'tha38223_thaihung2',
        multipleStatements: true
    },
    secret: "BNMPRDBNM",
}
};
module.exports = config;

