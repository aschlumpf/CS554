const data = require('./data');

const getById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const [res] = data.filter((user) => user.id === id);
      if (res) {
        resolve(res);
      } else {
        reject(new Error(`No user with ID ${id}`));
      }
    }, 5000);
  });
};

module.exports = { getById: getById };
