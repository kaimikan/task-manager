const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) return reject("Number must be positive");
      resolve(a + b);
    }, 2000);
  });
};

// async functions always return a Promise with whatever the function return (undefined if nothing)
// the Promise gets fulfilled with the return data
// we can use code that looks synchronous to perform asynchronous tasks
const doWork = async () => {
  //throw new Error("Something went wrong");
  const sum = await add(1, 99);
  const sum2 = await add(123, 992);
  const sum3 = await add(1213, 919);
  return sum3;
};

doWork()
  .then((result) => {
    console.log("result", result);
  })
  .catch((e) => {
    console.log("e", e);
  });
