'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const updateUI = function (currAcc) {
  //Display Movements
  displayMovements(currAcc);
  //Display Summary
  calcDisplaySummary(currAcc);
  //Display Balance
  calcDisplayBalance(currAcc);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (currentMov, i, arr) {
    const type = currentMov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()}</div>
        <div class="movements__value">${currentMov}€</div>
     </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  );
  labelSumOut.textContent = `${outcomes}€`;

  const interested = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interested}€`;
};

const creatingUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
creatingUsername(accounts);
console.log(accounts);

// const calcPrintBalance = function (accs) {
//   accs.forEach(function (acc) {
//     acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
//   });
// };
// calcPrintBalance(accounts);
// console.log(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

let currentAcc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(`LogIn`);
  currentAcc = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
    //Display Movements
    updateUI(currentAcc);
  }
  //Display UI and message

  //Display movements

  //Display summary
  // console.log(currentAcc);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  const reciverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(reciverAccount, amount);

  if (
    amount > 0 &&
    reciverAccount &&
    currentAcc.balance >= amount &&
    reciverAccount?.userName !== currentAcc.userName
  ) {
    // console.log(`Transfer valid`);
    currentAcc.movements.push(-amount);
    reciverAccount.movements.push(amount);
    updateUI(currentAcc);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('Delete');
  if (
    currentAcc.userName === inputCloseUsername.value &&
    currentAcc.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      mov => mov.userName === currentAcc.userName
    );
    // console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
  labelWelcome.textContent = 'Log in to get started';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amountLoan = Number(inputLoanAmount.value);
  if (
    amountLoan > 0 &&
    currentAcc.movements.some(mov => mov >= amountLoan / 10)
  ) {
    currentAcc.movements.push(amountLoan);
    updateUI(currentAcc);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});
let currentlySorting = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAcc, !currentlySorting);
  currentlySorting = !currentlySorting;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//SLICE NO MUTATE
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log(arr.slice(1, 2));

//SPLICE MUTATE
// console.log(arr.splice(2));
console.log(arr);
console.log(arr.splice(-1));
console.log(arr);
console.log(arr.splice(1, 2));
console.log(arr);

//REVERSE MUTATE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//CONCAT NO MUTATE
const letters = arr.concat(arr2);
console.log(letters);

//JOIN NO MUTATE
console.log(letters.join('-'));

//AT NO MUTATE
const arrNew = [23, 11, 64];
console.log(arrNew[0]);
console.log(arrNew.at(0));
console.log(arrNew[arrNew.length - 1]);
console.log(arrNew.at(arrNew.length - 1));
console.log(arrNew.slice(-1)[0]);
console.log(arrNew.at(-1));
console.log('jonas'.at(-1));

//DATA
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//FOREACH
for (const [key, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement: ${key + 1}: You desposited ${movement}`);
  } else {
    console.log(`Movement: ${key + 1}: You withdrew ${Math.abs(movement)}`);
  }
}
console.log(`---FOREACH---`);
movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index + 1}: You desposited ${movement}`);
  } else {
    console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
  }
});
//BREAK DOES NOT WORK IN HERE

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}:${value}`);
});

console.log('===Challenge 1===');
//MINE
// const dogoFunc = function (value, i) {
//   console.log(
//     `The dogo number ${i + 1} is ${value >= 3 ? 'an adult' : 'a puppy'}`
//   );
// };

// const checkDogs = function (dogsJulia, dogsKate) {
//   const arrBoth = dogsJulia.concat(dogsKate);
//   arrBoth.forEach(dogoFunc);
// };

// let juliaArr = [3, 5, 2, 12, 7];
// let kateArr = [4, 1, 15, 8, 3];

// checkDogs(juliaArr, kateArr);

// let juliaCorrected = juliaArr.slice();
// juliaCorrected.splice(0, 1);
// juliaCorrected.splice(-2);
// console.log(juliaCorrected);

// const arrayCorrected = juliaCorrected.concat(kateArr);

// arrayCorrected.forEach(dogoFunc);

//TEACHERS
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  dogs.forEach(function (age, i) {
    console.log(
      `Dog number ${i + 1} is ${
        age >= 3 ? 'an adult' : 'a puppy'
      }, and is ${age} years old `
    );
  });
};
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const movementsMap = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;

// const movementsUSD = movementsMap.map(function (currEl) {
//   return currEl * eurToUsd;
// });
const movementsUSD = movementsMap.map(currEl => currEl * eurToUsd);

console.log(movementsMap);
console.log(movementsUSD);

const movementsUsdOf = [];
for (const current of movementsMap) {
  movementsUsdOf.push(current * eurToUsd);
}
console.log(movementsUsdOf);

const movementsDesctiptions = movementsMap.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDesctiptions);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

// const deposits = movements.filter(function (currEl, i, arr) {
//   return currEl > 0;
// });
const deposits = movements.filter((currEl, i, arr) => currEl > 0);

const withdrawal = movements.filter(mov => mov < 0);

console.log(deposits);
console.log(withdrawal);

// const globalBalance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration number ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(globalBalance);
let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

const globalBalance = movements.reduce((acc, cur, i, arr) => acc + cur, 0);

console.log(globalBalance);

const maxValue = movements.reduce((acc, value) => {
  return value > acc ? value : acc;
}, movements[0]);
console.log(maxValue);

console.log('---Challenge #2---');

const data1 = [5, 2, 4, 1, 15, 8, 3];
const data2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAbeerageHumanAge = arrDogs =>
//   arrDogs.map(age => (age <= 2 ? age * 2 : 16 + age * 4));

// const dogosHuman = calcAbeerageHumanAge(data1);
// console.log(dogosHuman);

// const dogosFiltered = dogosHuman.filter(value => value > 18);
// console.log(dogosFiltered);

// let dogosAverage = dogosFiltered.reduce((acc, value, i) => {
//   return acc + value;
// }, dogosFiltered[0]);
// dogosAverage = dogosAverage / dogosFiltered.length;
// console.log(dogosFiltered);
// console.log(dogosAverage);

const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
  console.log(humanAges);
  const dogosFiltered = humanAges.filter(value => value > 18);
  console.log(dogosFiltered);

  const dogosAverage =
    dogosFiltered.reduce((acc, value, i) => {
      return acc + value;
    }, 0) / dogosFiltered.length;

  return dogosAverage;
};

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));

console.log(movements);

const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUSD);

const calcAverageHumanAgeChainin = dogos =>
  dogos
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

console.log(calcAverageHumanAgeChainin(data1));
console.log(calcAverageHumanAgeChainin(data2));

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

console.log(movements.includes(-130));

console.log(movements.some(mov => mov > 0));
console.log(movements.some(mov => mov === -130));

console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

const desposit = mov => mov > 0;
console.log(movements.every(desposit));
console.log(account4.movements.every(desposit));

const arrTestMethods = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arrTestMethods.flat());

const arrDeep = [[[1, 2, 3]], [[4, 5], 6], 7, 8];
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((curr, mov) => curr + mov, 0);
// console.log(overalBalance);

const overalBalanceChain = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalanceChain);

const overalFlatMap = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalFlatMap);

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

console.log(movements);

// return < 0, A,B
// return > 0, B,A
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
movements.sort((a, b) => a - b);

console.log(movements);

// movements.sort((a, b) => {
//   if (a < b) return 1;
//   if (b < a) return -1;
// });
movements.sort((a, b) => b - a);

console.log(movements);

const x = new Array(7);
console.log(x);

// x.fill(1);
// x.fill(1, 3);
x.fill(1, 3, 5);
console.log(x);

const arrFill = [1, 2, 3, 4, 5, 6, 7];
arrFill.fill(23, 2, 6);
console.log(arrFill);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const diceRolls = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1
);
console.log(diceRolls);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

// Array Methods Practice
// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositSum);

// 2.
// const numDesposits1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(numDesposits1000);

const numDesposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
console.log(numDesposits1000);

// let a = 10;
// console.log(a++);
// console.log(a);

//Prefixed ++ operator
// let a = 10;
// console.log(++a);

3;
const { desposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr >= 0 ? (sums.desposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? 'desposits' : 'withdrawals'] += curr;
      return sums;
    },
    { desposits: 0, withdrawals: 0 }
  );
console.log(desposits, withdrawals);

// // 4.
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

//   const titleCase = title
//     .toLocaleLowerCase()
//     .split(' ')
//     .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//     .join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// const { perdida, ganancia } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (obj, mov) => {
//       // mov > 0 ? (obj.ganancia += mov) : (obj.perdida += mov);
//       obj[mov > 0 ? 'ganancia' : 'perdida'] += mov;
//       return obj;
//     },
//     { perdida: 0, ganancia: 0 }
//   );
// console.log(ganancia, perdida);

const censoredWords = function (str) {
  const cammelCase = strCammel =>
    strCammel[0].toUpperCase() + strCammel.slice(1);
  const bannedWords = ['fucking', 'mf', 'stfu', 'idiot'];
  const words = str
    .toLowerCase()
    .split(' ')
    .map(curWord =>
      bannedWords.includes(curWord) ? '*****' : cammelCase(curWord)
    )
    .join(' ');
  return words;
};

console.log(
  censoredWords(
    'Yooo this fucking idiot just disappeared, u know what. STFU this mF will not come today'
  )
);

console.log('========CHALLENGE 4========');

const dogs = [
  { weight: 22, currFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, currFood: 200, owners: ['Matilda'] },
  { weight: 13, currFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, currFood: 340, owners: ['Michael'] },
];

dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});

console.log(dogs);

const eatingByOwner = function (ownerName) {
  let objOwner;
  dogs.forEach(dog => {
    if (dog.owners.some(owner => owner === ownerName)) {
      objOwner = dog;
    }
  });
  if (
    objOwner?.currFood > objOwner?.recommendedFood * 0.9 &&
    objOwner?.currFood < objOwner?.recommendedFood * 1.1
  ) {
    console.log(`Eating well`);
  } else {
    console.log(`Eating bad`);
  }
};

eatingByOwner('Michael');

const ownersEatTooMuch = dogs
  .filter(dog => dog.currFood > dog.recommendedFood * 1.1)
  .flatMap(obj => obj.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.currFood < dog.recommendedFood * 0.9)
  .flatMap(obj => obj.owners);
console.log(ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

console.log(dogs.some(dog => dog.currFood === dog.reciverAccount));

console.log(
  dogs.some(
    dog =>
      dog.currFood > dog.recommendedFood * 0.9 &&
      dog.currFood < dog.recommendedFood * 1.1
  )
);

const dogsEatingOkay = dogs.filter(
  dog =>
    dog.currFood > dog.recommendedFood * 0.9 &&
    dog.currFood < dog.recommendedFood * 1.1
);

console.log(dogsEatingOkay);

const copyObj = dogs.map(dog => dog.recommendedFood);
console.log(copyObj);

copyObj.sort((dogA, dogB) => {
  if (dogA > dogB) {
    return 1;
  }
  if (dogB > dogA) {
    return -1;
  }
});
console.log(copyObj);

// return < 0, A,B
// return > 0, B,A
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });

console.log('========CHALLENGE 4 Solution========');

const dogsSol = [
  { weight: 22, currFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, currFood: 200, owners: ['Matilda'] },
  { weight: 13, currFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, currFood: 340, owners: ['Michael'] },
];
// 1.
dogsSol.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogsSol);
// 2.
const dogSarah = dogsSol.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);
console.log(
  `Sarah's dog is eating ${
    dogSarah.currFood > dogSarah.recommendedFood ? 'too much' : 'too little'
  }`
);
// 3.
const ownersEatTooMuchSol = dogsSol
  .filter(dog => dog.currFood > dog.recommendedFood)
  .flatMap(obj => obj.owners);
console.log(ownersEatTooMuchSol);

const ownersEatTooLittleSol = dogsSol
  .filter(dog => dog.currFood < dog.recommendedFood)
  .flatMap(obj => obj.owners);
console.log(ownersEatTooLittleSol);

// 4.
console.log(`${ownersEatTooMuchSol.join(' and')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittleSol.join(' and ')}'s dogs eat too little!`);

// 5.
console.log(dogsSol.some(dog => dog.currFood === dog.recommendedFood));

// 6.
const checkOkay = dog =>
  dog.currFood > dog.recommendedFood * 0.9 &&
  dog.currFood < dog.recommendedFood * 1.1;
console.log(dogsSol.some(checkOkay));

// 7.
console.log(dogsSol.filter(checkOkay));

// 8.
const dogCopySorted = dogsSol
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogCopySorted);
