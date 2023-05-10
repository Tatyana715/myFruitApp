const fs = require('fs');
const csv = require('csv-parser');

const filePath = ".//basket.csv";
const fruits = {};
const oldFruits = {};
let oldFruitsCount = 0;

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const { name, size, color, shape, days } = row;
    if (!fruits[name]) {
      fruits[name] = {
        count: 0,
        characteristics: {}
      };
    }
    fruits[name].count += parseInt(size);
    if (!fruits[name].characteristics[color]) {
      fruits[name].characteristics[color] = {};
    }
    if (!fruits[name].characteristics[color][shape]) {
      fruits[name].characteristics[color][shape] = parseInt(size);
    } else {
      fruits[name].characteristics[color][shape] += parseInt(size);
    }
    if (parseInt(days) > 3) {
      oldFruitsCount += parseInt(size);
      if (!oldFruits[name]) {
        oldFruits[name] = parseInt(size);
      } else {
        oldFruits[name] += parseInt(size);
      }
    }
  })
  .on('end', () => {
    console.log('Total number of fruit: ', Object.values(fruits).reduce((acc, { count }) => acc + count, 0));
    console.log('');
    console.log('Types of fruit: ', Object.keys(fruits).length);
    console.log('');
    console.log('The number of each type of fruit in descending order: ');
    const sortedFruits = Object.entries(fruits).sort(([, a], [, b]) => b.count - a.count);
    sortedFruits.forEach(([name, { count }]) => {
      console.log(`${count} ${name}`);
    });
    console.log('');
    console.log('The characteristics of each fruit by type:');
    Object.entries(fruits).forEach(([name, { characteristics }]) => {
      Object.entries(characteristics).forEach(([color, shapes]) => {
        Object.entries(shapes).forEach(([shape, count]) => {
          console.log(`${count} ${name}: ${color}, ${shape}`);
        });
      });
    });
    console.log('');
    console.log('Have any fruit been in the basket for over 3 days:');
    Object.entries(oldFruits).forEach(([name, count]) => {
      console.log(`${count} ${name} `);
    });
    console.log(`- are over 3 days old`);
  });
