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

  const dataGuru = [
    { name: 'Mila Yaelasari', nuptk: 1, result: '0.408' },
    { name: 'Radiani Srirestuti', nuptk: 2, result: '0.469' },
    { name: 'Agus Tiyono', nuptk: 3, result: '0.452' },
    { name: 'Heny Handayani', nuptk: 4, result: '0.417' },
    { name: 'Dea Rijaul', nuptk: 5, result: '0.465' },
    { name: 'Putri Riandini', nuptk: 6, result: '0.465' },
  ];
  const valueLink = [
    [4.625, 4.4, 4.425, 4.825],
    [4.475, 4.525, 4.525, 4.625],
    [4.525, 4.45, 4.325, 4.35],
    [4.3, 4.45, 4.375, 4.55],
    [4.675, 4.775, 4.525, 4.55],
    [4.525, 4.625, 4.5, 4.575],
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
