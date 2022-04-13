const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 10);
  });
};

// Without chaining
/* add(1, 2)
  .then((sum) => {
    console.log(sum);

    add(sum, 4)
      .then((sum2) => {
        console.log(sum2);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  }); */

// With Chaining
add(1, 2)
  .then((sum) => {
    console.log(sum);
    return add(sum, 4);
  })
  .then((sum2) => {
    console.log(sum2);
  })
  .catch((e) => {
    console.log(e);
  });
