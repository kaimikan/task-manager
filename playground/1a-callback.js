const doWorkCallback = (callback) => {
  setTimeout(() => {
    // note: we do not have any hardcoded logic stopping us from calling both callbacks
    //callback("This is my error!", undefined);
    callback(undefined, "Success data...");
  }, 2000);
};

doWorkCallback((error, result) => {
  if (error) {
    return console.log(error);
  }

  console.log(result);
});
