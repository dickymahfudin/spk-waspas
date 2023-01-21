const hitung = (allData, kriteria) => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const waspas = datas => {
    const resultNormalisasi = (arr, kriteria) => {
      const param = kriteria.name;
      const bobot = kriteria.bobot;
      const matrix = arr.map(val => val[param]);
      const sumbuX = kriteria.jenis === 1 ? Math.max(...matrix) : Math.min(...matrix);
      const normalisasi = matrix.map(x => +(x / sumbuX).toFixed(3));
      const q = normalisasi.map(e => {
        const q1 = +(e * bobot).toFixed(3);
        const q2 = +Math.pow(e, bobot).toFixed(3);
        return { q1, q2 };
      });
      return { matrix, sumbuX, normalisasi, q };
    };
    const data = datas.map(data => {
      const array = Object.values(data);
      return array.slice(2, array.length);
    });
    const matrix1 = data.map(matrix => {
      return matrix.join('&');
    });
    const matrixD = kriteria.map(kriteria => {
      return resultNormalisasi(datas, kriteria);
    });
    const lengthI = matrixD[0].normalisasi.length;
    const lengthJ = matrixD.length;
    const newMatrix2 = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));
    const newMatrixQ = new Array(lengthI).fill(0).map(() => new Array(lengthJ).fill(0));

    matrixD.forEach((el, i) => {
      el.normalisasi.forEach((element, j) => {
        newMatrix2[j][i] = element;
      });
      el.q.forEach((element, j) => {
        newMatrixQ[j][i] = element;
      });
    });
    const matrix2 = newMatrix2.map(matrix => {
      return matrix.join('&');
    });
    const hasil = newMatrixQ.map((matrix, i) => {
      const lokasi = datas[i];
      const q1 = +(0.5 * matrix.map(e => e.q1).reduce(reducer)).toFixed(3);
      const q2 = +(0.5 * matrix.map(e => e.q2).reduce(reducer)).toFixed(3);
      const q = +(q1 + q2).toFixed(3);
      return { id: lokasi.id, a: `A${i + 1}`, name: lokasi.name, q1, q2, q };
    });
    hasil.sort((a, b) => b.q - a.q);
    return {
      matrix1: matrix1.join('\\\\'),
      matrix2: matrix2.join('\\\\'),
      perhitungan: matrixD,
      hasil,
    };
  };
  const hasilWaspas = waspas(allData);

  return { waspas: hasilWaspas };
};

module.exports = hitung;
