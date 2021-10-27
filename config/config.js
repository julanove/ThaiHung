var config = {
  local: {

    url: "http://localhost:3000/",

    database: {
      host: "nsy.cbhua0eomxih.ap-southeast-1.rds.amazonaws.com",
      user: 'admin',
      password: '12345678',
      database: 'tha38223_thaihung2',
      multipleStatements: true
    },

    secret: "BNMLOCALBNM",
  },
  development: {
  
    url: "https://thaihung.herokuapp.com/",
   
    database: {
          host: "nsy.cbhua0eomxih.ap-southeast-1.rds.amazonaws.com",
          user: 'admin',
          password: '12345678',
          database: 'tha38223_thaihung2',
          multipleStatements: true
      },
    secret: "BNMDEVBNM",
  },
  
production: {
   
    url: "https://thaihung.herokuapp.com/",

    database: {
      host: "nsy.cbhua0eomxih.ap-southeast-1.rds.amazonaws.com",
      user: 'admin',
      password: '12345678',
      database: 'tha38223_thaihung2',
      multipleStatements: true
    },
    secret: "BNMPRDBNM",
}
};
module.exports = config;

