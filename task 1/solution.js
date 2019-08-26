const n = +prompt('tree height', '');

if (n && parseInt(n, 10) === n) {
  if (n > 2 && n < 20) {
    for (let i = 0; i < n; i += 1) {
      let string = '';
      let ball = 0;

      if (i % 2 !== 0) {
        ball = Math.floor(Math.random() * (2 * i + 1) + 1);
      }
      for (let j = 1; j <= 2 * i + 1; j += 1) {
        if (ball === j) {
          string += 'o';
        } else {
          string += '*';
        }
      }
      for (let k = 1; k < n - i; k += 1) {
        string = `_${string}_`;
      }
      console.log(string);
    }
  }
} else {
  console.log("%c Oops, it isn't a tree height :(", 'color: red;');
}
