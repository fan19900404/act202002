const abc = new Promise((r) => { r([[123]].flat()); });
abc.then((r) => console.log(r));
