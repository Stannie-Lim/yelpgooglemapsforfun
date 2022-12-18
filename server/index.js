const app = require("./app");

const init = async () => {
  try {
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () =>
      console.log(`listening on port ${port}`)
    );
  } catch (ex) {
    console.log(ex);
  }
};

init();
