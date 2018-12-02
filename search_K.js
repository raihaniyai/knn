const DataTrain = require('./DataTrain.json');
const DataTest = require('./DataTest.json');
const fs = require('fs');

const TRAINING_LENGTH = 800;
function loadDataSet(split, trainingSet, testSet) {
  for (let i = 0; i < TRAINING_LENGTH; i += 1) {
    if (Math.random() < split) {
      trainingSet.push(DataTrain[i]);
    } else {
      testSet.push(DataTrain[i]);
    }
  }
}

function euclideanDistance(testData, trainData, length) {
  let distance = 0;
  for (var i = 0; i < length; i++) distance += (testData[`X${i + 1}`] - trainData[`X${i + 1}`]) ** 2;
  return Math.sqrt(distance);
}

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

function getAccuracy(testSet, predictions) {
  let correct = 0;
  for (var i = 0; i < testSet.length; i++) {
    if (testSet[i].Y == predictions[i]) {
      correct += 1;
    }
  }
  return (correct / testSet.length) * 100.0;
}

const dataK = [];
for (var z = 1; z < 16; z += 2) {
  let totalAccuracy = 0;
  for (var j = 0; j < 6; j++) {
    const TRAINING_SET = [];
    const TRAINING_TESTSET = [];

    loadDataSet(0.6, TRAINING_SET, TRAINING_TESTSET);
    const predictions = [];
    const k = z;
    for (let i = 0; i < TRAINING_TESTSET.length; i += 1) {
      const neighbors = getNeighbors(TRAINING_SET, TRAINING_TESTSET[i], k);
      const result = getResult(neighbors);
      predictions.push(result);
    }
    const accuracy = getAccuracy(TRAINING_TESTSET, predictions);
    console.log(`k: ${k}, Akurasi: ${accuracy}%`);
    totalAccuracy += accuracy;
  }
  const tempK = {
    k: z,
    accuracy: totalAccuracy / 6,
  };
  console.log(`Rata-rata akurasi pada k = ${tempK.k}: ${tempK.accuracy}%\n`);
  dataK.push(tempK);
}
fs.writeFile('akurasi_K.json', dataK,()=> console.log("Detail akurasi masing-masing K berhasil disimpan"));
