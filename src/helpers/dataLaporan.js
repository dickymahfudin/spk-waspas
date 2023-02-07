const models = require('../models');

const criterias = async () => {
  const createdAt = new Date();
  const updatedAt = new Date();
  //   0,25
  // 0,35
  // 0,2
  // 0,2
  const dataKriteria = [
    { name: 'Pedagogik', bobot: 0.25, jenis: 1, createdAt, updatedAt },
    { name: 'Sosial', bobot: 0.2, jenis: 1, createdAt, updatedAt },
    { name: 'Profesional', bobot: 0.2, jenis: 1, createdAt, updatedAt },
    { name: 'Kepribadian', bobot: 0.35, jenis: 1, createdAt, updatedAt },
  ];

  let dataGuru = [
    { name: 'Mila Yaelasari', result: '0.408' },
    { name: 'Radiani Srirestuti', result: '0.469' },
    { name: 'Agus Tiyono', result: '0.452' },
    { name: 'Heny Handayani', result: '0.417' },
    { name: 'Dea Rijaul', result: '0.465' },
    { name: 'Putri Riandini', result: '0.465' },

    { name: 'Ir. Liliek Rahmaningsih' },
    { name: 'Deden Hendradi' },
    { name: 'Dra. Liesye Yulianti' },
    { name: 'Drs.Fuji Marhaen' },
    { name: 'Erwin Hasiholan G.' },
    { name: 'Sandi Sopyan' },
    { name: 'Luki Nurdiansyah' },
    { name: 'Aditya Nugraha' },
    { name: 'Tun Utama P' },
    { name: 'Sugino' },
    { name: 'Tati Suryati' },
    { name: 'Ari Adithya Chandra' },
    { name: 'Zaenal Mutaqin' },
    { name: 'Yeni Yuliawati' },
    { name: 'Dara Purwanita' },
    { name: 'Dra. Diana Octaria' },
  ];
  dataGuru = dataGuru.map((el, i) => ({ ...el, nuptk: i + 1 }));
  const valueLink = [
    [4.625, 4.4, 4.425, 4.825],
    [4.475, 4.525, 4.525, 4.625],
    [4.525, 4.45, 4.325, 4.35],
    [4.3, 4.45, 4.375, 4.55],
    [4.675, 4.775, 4.525, 4.55],
    [4.525, 4.625, 4.5, 4.575],

    [3.807, 4.54, 3.954, 4.104],
    [4.722, 3.032, 3.262, 3.04],
    [3.464, 3.292, 3.046, 3.131],
    [3.607, 3.915, 4.931, 4.661],
    [3.22, 3.005, 4.135, 4.281],
    [4.067, 4.72, 4.297, 3.732],
    [4.866, 4.187, 3.61, 3.189],
    [4.503, 3.452, 3.612, 4.205],
    [3.076, 4.349, 3.464, 4.21],
    [4.053, 4.971, 4.119, 3.752],
    [4.439, 4.907, 4.232, 4.392],
    [3.776, 3.806, 4.315, 4.048],
    [4.745, 3.065, 3.737, 4.591],
    [3.346, 4.346, 3.927, 4.144],
    [3.529, 3.697, 4.257, 4.876],
    [4.434, 3.954, 3.129, 3.094],
  ];
  const kriterias = await models.kriteria.bulkCreate(dataKriteria);
  const guru = await models.teacher.bulkCreate(dataGuru);

  for (const i in guru) {
    if (Object.hasOwnProperty.call(guru, i)) {
      const location = guru[i];
      for (const j in kriterias) {
        if (Object.hasOwnProperty.call(kriterias, j)) {
          const criteria = kriterias[j];
          await models.link.create({
            teacher_id: location.id,
            kriteria_id: criteria.id,
            value: valueLink[i][j],
          });
        }
      }
    }
  }
  return { status: 'success' };
};

module.exports = criterias;
