// promise can either be rejected (reject) or fulfilled (resolve)

const doWorkPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // note: only a reject or a resolve can be passed, not both
    //reject("This is my error!");
    resolve("Success data...");
  }, 2000);
});

doWorkPromise
  .then((result) => {
    console.log("Nice Job! ", result);
  })
  .catch((error) => {
    console.log("Oof... ", error);
  });
