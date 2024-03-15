const app = require('./express/server');

const port = 8080;

app.listen(port, () => {
      console.log(`App listening on port ${port}`)
})