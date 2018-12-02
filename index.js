const json2csv = require('json2csv');
const fs = require('fs');
const DataTrain = require('./DataTrain.json');
const DataTest = require('./DataTest.json');

function getNeighbors(trainSet, testSet, k) {
  var distance = [];
  for (var i = 0; i < trainSet.length; i++) {
    const length = Object.keys(testSet).length - 1;
    const jarak = euclideanDistance(testSet, trainSet[i], length - 1);
    distance.push([trainSet[i], jarak]);
  }
  distance.sort((a, b) => a[1] - b[1]);
  var neighbors = [];
  for (var i = 0; i < k; i++) neighbors.push(distance[i][0]);
  return neighbors;
}

function getResult(neighbors) {
  const coorY = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (var i = 0; i < neighbors.length; i++) {
    const response = neighbors[i].Y;
    if (response === 3) coorY[3] += 1;
    else if (response === 2) coorY[2] += 1;
    else if (response === 1) coorY[1] += 1;
    else coorY[0] += 1;
  }
  var maxData = null
  var maxValue = -1
  for (var data in coorY) {
    var value = coorY[data]
    if (value > maxValue) {
      maxData = data
      maxValue = value
    }
  }
  return maxData
}

function euclideanDistance(testData, trainData, length) {
  let distance = 0;
  for (var i = 0; i < length; i++) distance += (testData[`X${i + 1}`] - trainData[`X${i + 1}`]) ** 2;
  return Math.sqrt(distance);
}

var hasil = DataTest;
const predictions = [];
const k = 11;
for (var i = 0; i < DataTest.length; i += 1) {
  const neighbors = getNeighbors(DataTrain, DataTest[i], k);
  const result = getResult(neighbors);
  predictions.push(result);
  console.log(`Index Data: ${DataTest[i].Index}, Koordinat Y: ${result}`);
  hasil[i]['Y'] = result;
}
const fields = ['Index', 'X1', 'X2', 'X3', 'X4', 'X5', 'Y'];
const csv = json2csv({ data: hasil, fieldNames: fields });

fs.writeFile('TebakanTugas3.csv', csv, () => {
  console.log('\nFile TebakanTugas2.csv berhasil disimpan kak! :D');
});
