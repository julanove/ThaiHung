const AdminBro = require('admin-bro')
const AdminBroExpress = require('admin-bro-expressjs')
const AdminBroMongoose = require('admin-bro-mongoose')

const User = require('./models/user')
const News = require('./models/news')

const userParent = {
    name: 'User',
    icon: 'Accessibility',
}

const infoParent = {
    name: 'Information',
    icon: 'Accessibility',
}



AdminBro.registerAdapter(AdminBroMongoose)
const adminBro = new AdminBro({
      rootPath: '/admin',
      resources: [
          {
               resource: User,
              options: {
                  parent: userParent,
                   properties: {
                       name: { isVisible: { list: true, filter: true, show: true, edit: false } },
                       email: { isVisible: { list: true, filter: true, show: true, edit: false } },
                       password: { isVisible: { list: false, filter: false, show: true, edit: false } },
                       avatar_url: { isVisible: { list: false, filter: false, show: true, edit: false } },
                       created_at: { isVisible: { list: true, filter: false, show: true, edit: false } }
                   }
               }
          },
          {
              resource: News,
              options: {
                  parent: infoParent,
                  properties: {
                      newsID: { isVisible: { list: true, filter: false, show: true, edit: false } },
                      title: { isVisible: { list: true, filter: true, show: true, edit: true } },
                      content: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      image: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      createUser: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      createDate: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      updateUser: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      updateDate: { isVisible: { list: true, filter: false, show: true, edit: true } },
                      Type: { isVisible: { list: true, filter: false, show: true, edit: true } }
                  }
              }
          },

    ],
    branding: {
        logo: 'images/logo/logo.png',
        companyName: 'Thai Hung Company',
        softwareBrothers: false   // if Software Brothers logos should be shown in the sidebar footer
    },

})

module.exports = adminRouter = AdminBroExpress.buildRouter(adminBro)