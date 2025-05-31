const throwCustomError = async function (req, res) {
  const errorMessage = "KA BOOM!";
  throw new Error(errorMessage);
};

module.exports = { throwCustomError };
